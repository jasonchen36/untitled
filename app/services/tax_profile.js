const //packages
    promise = require('bluebird'),
    _ = require('lodash'),
    moment = require('moment'),
//services
    session = require('./session'),
    util = require('./util'),
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
                return promise.reject('api - account session creation - validation errors');
            } else {
                const taxProfileSession = req.session.taxProfile;
                taxProfileSession.users[0].firstName = req.body.firstName;
                taxProfileSession.currentPage = getCurrentPage(req.body.action);
                taxProfileSession.expiry = moment().add(7, 'days');//refresh after update
                req.session.taxProfile = taxProfileSession;
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
                return promise.reject('api - account session creation - validation errors');
            } else {
                const taxProfileSession = req.session.taxProfile,
                    dataLengthDifference = Math.max(_.size(req.body.data),3)-taxProfileSession.users.length;//minimum of 3 as per model declaration

                //expand or contract tax profile users array to match data
                if (dataLengthDifference > 0){
                    var taxProfileObject;
                    _.forOwn(req.body.data, function(value, key) {
                        if(!_.find(taxProfileSession.users, ['id', key])){
                            taxProfileObject = sessionModel.getTaxProfileUserObject();
                            taxProfileObject.id = key;
                            taxProfileSession.users.push(taxProfileObject);
                        }
                    });
                } else if (dataLengthDifference < 0) {
                    for(var i = 0; i < taxProfileSession.users.length; i++){
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
                req.session.taxProfile = taxProfileSession;
                return promise.resolve();
            }
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
                const taxProfileSession = req.session.taxProfile;
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
                                taxProfileSession.users.slice(0, 3);//delete all extra other entries
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
                req.session.taxProfile = taxProfileSession;
                return promise.resolve();
            }
        });
};

module.exports = taxProfile;