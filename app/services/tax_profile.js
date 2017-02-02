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
          
                var dataObject = session.getUserProfileSession(req);

                if(typeof dataObject !== 'undefined'  && typeof  dataObject.hasUserProfileSession  !== 'undefined')
                {
                    var activities = taxProfileSession.users[0].activities;
                    taxProfileSession.users = [];
                    var index = 0;
                    dataObject.taxReturns.forEach(function (entry) {

                         var migratedTR = {};
                         migratedTR.id = entry.accountId;
                         if(index === 1)
                         {
                            migratedTR.id =  migratedTR.id + '-spouse';
                         }
                         if(index > 1)
                         {
                            migratedTR.id =  migratedTR.id + '-other';
                         }                        


                         migratedTR.firstName = entry.firstName;
                         migratedTR.taxReturnId  = entry.taxReturnId;
                         migratedTR.migrated_user = "Yes";
                         migratedTR.activities = activities; 
                         taxProfileSession.users.push(migratedTR);

                         index++;

                    });

                }

             
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

                //filter out duplicates ids due to int vs string comparison
                taxProfileSession.users = _.uniqBy(taxProfileSession.users, function (entry) {
                    return String(entry.id);
                });

                taxProfileSession.currentPage = getCurrentPage(req.body.action);
                taxProfileSession.expiry = moment().add(7, 'days');//refresh after update
                return promise.resolve(session.setTaxProfileSession(req, taxProfileSession));
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
                        if (parseInt(key) === 127) {//todo, find better way of linking these questions
                            //spouse
                            if (parseInt(value) === 1) {


                                if(taxProfileSession.users.length < 2)
                                {
                                     taxProfileSession.users.push( { });
                                }

                                //don't write over existing objects
                                if (!taxProfileSession.users[1].hasOwnProperty('id')) {
                                    taxProfileSession.users[1] = sessionModel.getTaxProfileUserObject();
                                    taxProfileSession.users[1].id = taxProfileSession.users[0].id + '-spouse';
                                }
                            } else {
                                taxProfileSession.users[1] = {};
                            }
                        } else if (parseInt(key) === 128) {//todo, find better way of linking these questions
                            //other

                                if(taxProfileSession.users.length < 3)
                                {
                                     taxProfileSession.users.push( { });
                                }


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
                    uri: process.env.API_URL+'/tax_returns',
                    json: true
                };

            var accountId = taxProfileSession.users[0].id;
            var taxReturnRequestObject,
                taxReturnBody = [],
                userbeingUpdated = [];


             taxProfileSession.users.forEach(function(entry) {
                 if (entry.taxReturnId === "") {
                    var filerType = "";
                    if (parseInt(entry.id)) {
                       filerType = "primary";
                    }
                    if (entry.id.toString().includes("spouse")) {
                      filerType = "spouse";
                    }
                    if (entry.id.toString().includes("other")) {
                      filerType = "other";
                    }

                       taxReturnBody.push({
                            accountId: accountId,
                            productId: process.env.API_PRODUCT_ID,
                            firstName: entry.firstName,
                            filerType: filerType
                        });

                       userbeingUpdated.push(entry);
     
                    }
             });

            requestObject.body =  { "taxReturns": taxReturnBody };
        

            if(taxReturnBody.length > 0)
            {
                return requestPromise(requestObject).then(function (response) {

                    var i = 0;
                    userbeingUpdated.forEach(function(entry){
                        if (response[i] != null && entry.hasOwnProperty('id')) {
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

            }  else  {
                return promise.resolve(session.setTaxProfileSession(req, taxProfileSession));   
            }



        })
        .then(function(response){

             var taxProfileSession = session.getTaxProfileSession(req);

            //create quote request
            const requestObject = {
                method: 'POST',
                uri: process.env.API_URL+'/quote',
                body: {
                    accountId: taxProfileSession.users[0].id,
                    productId: parseInt(process.env.API_PRODUCT_ID),
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

                        _.forOwn(groupValue, function(value, key) {
                            quoteBodyObject.answers.push({
                                questionId: parseInt(key),
                                text: parseInt(value) === 1 ? 'Yes' : 'No'
                            });
                        });
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
