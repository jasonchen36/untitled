const //packages
    promise = require('bluebird'),
    _ = require('lodash'),
    moment = require('moment'),
    requestPromise = require('request-promise'),
//services
    session = require('./session'),
    util = require('./util'),
    errors = require('./errors'),
//models
    sessionModel = require('../models/session'),
    taxProfile = {};

function getCurrentPage(action){
    return action.split('api-tp-')[1];
}

taxProfile.saveName = function(req){
    return promise.resolve()
        .then(function(){
            //validate
            req.checkBody('firstName').notEmpty();

            //can only create an account on the name step
            if (req.validationErrors() || req.body.action !== 'api-tp-welcome'){
                return promise.reject('api - tax profile welcome - validation errors');
            } else {
                const taxProfileSession = session.getTaxProfileSession(req);
                taxProfileSession.users[0].firstName = req.body.firstName;
                taxProfileSession.currentPage = getCurrentPage(req.body.action);
                taxProfileSession.expiry = moment().add(7, 'days');//refresh after update
                session.setTaxProfileSession(req, taxProfileSession);
                return promise.resolve();
            }
        });
};

taxProfile.saveFilersNames = function(req){
    return promise.resolve()
        .then(function(){
            //validate
            req.checkBody('data').notEmpty();

            if (req.validationErrors() || req.body.action !== 'api-tp-filers-names'){
                return promise.reject('api - tax profile filers names - validation errors');
            } else {
                const taxProfileSession = session.getTaxProfileSession(req),
                    otherFilerData = _.filter(req.body.data, function(value, key) { return key.indexOf('other') !== -1; }),//case where multiple "other"s are selected but not "spouse"
                    otherFilerCountDifference = Math.max(_.size(otherFilerData),1)-(taxProfileSession.users.length-2);//don't count primary and spouse filers

                //expand or contract tax profile users array to match data
                if (otherFilerCountDifference > 0){
                    var taxProfileObject;
                    _.forOwn(req.body.data, function(value, key) {
                        if(!_.find(taxProfileSession.users, ['id', key])){
                            taxProfileObject = sessionModel.getTaxProfileUserObject();
                            taxProfileObject.id = key;
                            taxProfileSession.users.push(taxProfileObject);
                        }
                    });
                } else if (otherFilerCountDifference < 0) {
                    //remove unused other entries
                    for(var i = 2; i < taxProfileSession.users.length; i++){
                        if(!req.body.data.hasOwnProperty(taxProfileSession.users[i].id)){
                            taxProfileSession.users.splice(i,1);
                        }
                    }
                }
                //update names
                taxProfileSession.users.forEach(function(entry) {
                    if (entry.hasOwnProperty('id')) {
                        entry.firstName = req.body.data[entry.id];
                    }
                });

                taxProfileSession.currentPage = getCurrentPage(req.body.action);
                taxProfileSession.expiry = moment().add(7, 'days');//refresh after update
                return promise.resolve(session.setTaxProfileSession(req, taxProfileSession));
            }
        })
        .then(function(taxProfileSession) {
            //create accounts for additional users if needed
            const requestObject = {
                method: 'POST',
                uri: process.env.API_URL+'/account',
                json: true
            };
            var accountRequestObject,
                filteredAccounts = _.filter(taxProfileSession.users, function(entry){
                    //check for if temporary id is assigned, then call api for real one
                    return (entry.hasOwnProperty('id') && typeof entry.id === 'string' && entry.id.indexOf('-') !== -1);
                }),
                accountRequests = _.map(filteredAccounts, function(entry) {
                    accountRequestObject = _.clone(requestObject, true);
                    accountRequestObject.body = {
                        productId: process.env.API_PRODUCT_ID,
                        name: entry.firstName
                    };
                    return requestPromise(accountRequestObject);
                });
            if (accountRequests.length > 0) {
                return promise.all(accountRequests)
                    .then(function (response) {
                        taxProfileSession.users.forEach(function (entry) {
                            if (entry.hasOwnProperty('id') && typeof entry.id === 'string' && entry.id.indexOf('-') !== -1) {
                                //replace temporary id with real id
                                entry.id = _.find(response, ['name', entry.firstName]).accountId;
                            }
                        });
                        session.setTaxProfileSession(req, taxProfileSession);
                        return promise.resolve();
                    })
                    .catch(function (response) {
                        var error = response;
                        if (response && response.hasOwnProperty('error')) {
                            error = response.error;
                        }
                        return promise.reject(new errors.InternalServerError(error));
                    });
            } else {
                return promise.resolve();
            }
        })
        .catch(function (error) {
            if (!error){
                error = 'Could not save filers names';
            }
            return promise.reject(new errors.InternalServerError(error));
        });
};

taxProfile.saveActiveTiles = function(req){
    return promise.resolve()
        .then(function() {
            //validate
            req.checkBody('data').notEmpty();

            if (req.validationErrors()){
                return promise.reject('api - tax profile update - validation errors');
            } else {
                const taxProfileSession = session.getTaxProfileSession(req);
                var group = getCurrentPage(req.body.action);
                //group nicename
                switch (group) {
                    case 'filing-for':
                        group = 'filingFor';
                        break;
                    case 'quote-applies':
                        group = 'quoteApplies';
                        break;
                }
                //special actions
                if (group === 'filingFor') {
                    _.forOwn(req.body.data[taxProfileSession.users[0].id], function (value, key) {
                        if (parseInt(key) === 9002) {//todo, find better way of linking these questions
                            //spouse
                            if (parseInt(value) === 1) {
                                //don't write over existing objects
                                if (!taxProfileSession.users[1].hasOwnProperty('id')) {
                                    taxProfileSession.users[1] = sessionModel.getTaxProfileUserObject();
                                    taxProfileSession.users[1].id = taxProfileSession.users[0].id + '-spouse';
                                }
                            } else {
                                taxProfileSession.users[1] = {};
                            }
                        } else if (parseInt(key) === 9003) {//todo, find better way of linking these questions
                            //other
                            if (parseInt(value) === 1) {
                                //don't write over existing objects
                                if (!taxProfileSession.users[2].hasOwnProperty('id')) {
                                    taxProfileSession.users[2] = sessionModel.getTaxProfileUserObject();
                                    taxProfileSession.users[2].id = taxProfileSession.users[0].id + '-other';
                                }
                            } else {
                                taxProfileSession.users[2] = {};
                                taxProfileSession.users = taxProfileSession.users.slice(0, 3);//delete all extra other entries
                            }
                        }
                    });
                }
                //save active tiles
                taxProfileSession.users.forEach(function (entry) {
                    if (entry.hasOwnProperty('activeTiles')) {
                        if (!entry.activeTiles.hasOwnProperty(group) && req.body.data.hasOwnProperty(entry.id)) {
                            entry.activeTiles[group] = {};
                        }
                        entry.activeTiles[group] = req.body.data[entry.id];
                    }
                });
                taxProfileSession.currentPage = getCurrentPage(req.body.action);
                taxProfileSession.expiry = moment().add(7, 'days');//refresh after update
                session.setTaxProfileSession(req, taxProfileSession);
                return promise.resolve();
            }
        });
};

taxProfile.getTaxReturnQuote = function(req){
    return promise.resolve()
        .then(function() {
            //create tax return ids
            const taxProfileSession = session.getTaxProfileSession(req),
                requestObject = {
                    method: 'POST',
                    uri: process.env.API_URL+'/tax_return',
                    json: true
                };
            var taxReturnRequestObject,
                taxReturnRequests = taxProfileSession.users.map(function(entry) {
                    if (entry.hasOwnProperty('id') && parseInt(entry.id) > 0) {
                        taxReturnRequestObject = _.clone(requestObject, true);
                        taxReturnRequestObject.body = {
                            accountId: entry.id,
                            productId: process.env.API_PRODUCT_ID,
                            firstName: entry.firstName
                        };
                        return requestPromise(taxReturnRequestObject);
                    }
                });
            return promise.all(taxReturnRequests)
                .then(function (response) {
                    var i = 0;
                    taxProfileSession.users.forEach(function(entry){
                        if (entry.hasOwnProperty('id') && parseInt(entry.id) > 0) {
                            entry.taxReturnId = response[i].taxReturnId;
                        }
                        i++;
                    });
                    session.setTaxProfileSession(req, taxProfileSession);
                    return promise.resolve(session.setTaxProfileSession(req, taxProfileSession));
                })
                .catch(function (response) {
                    var error = response;
                    if (response && response.hasOwnProperty('error')){
                        error = response.error;
                    }
                    return promise.reject(new errors.InternalServerError(error));
                });
        })
        .then(function(taxProfileSession){
            //create quote request
            const requestObject = {
                method: 'POST',
                uri: process.env.API_URL+'/quote',
                body: {
                    accountId: taxProfileSession.users[0].id,
                    productId: process.env.API_PRODUCT_ID,
                    taxReturns: []
                },
                json: true
            };
            var quoteBodyObject;
            taxProfileSession.users.forEach(function(entry) {
                if (entry.hasOwnProperty('taxReturnId') && entry.taxReturnId > 0) {
                    quoteBodyObject = {
                        taxReturnId: entry.taxReturnId,
                        answers: []
                    };
                    _.forOwn(entry.activeTiles, function(groupValue, groupKey) {
                        //todo, uncomment when real tile ids are on quote applies all screen
                        // _.forOwn(groupValue, function(value, key) {
                        //     quoteBodyObject.answers.push({
                        //         questionId: key,
                        //         text: parseInt(value) === 1 ? 'Yes' : 'No'
                        //     });
                        // });
                    });
                    requestObject.body.taxReturns.push(quoteBodyObject);
                }
            });
            return requestPromise(requestObject)
                .then(function (response) {
                    taxProfileSession.quote = response;
                    session.setTaxProfileSession(req, taxProfileSession);
                    return promise.resolve();
                })
                .catch(function (response) {
                    var error = response;
                    if (response && response.hasOwnProperty('error')){
                        error = response.error;
                    }
                    return promise.reject(new errors.InternalServerError(error));
                });
        })
        .catch(function (error) {
            if (!error){
                error = 'Could not get quote';
            }
            return promise.reject(new errors.InternalServerError(error));
        });
};

module.exports = taxProfile;