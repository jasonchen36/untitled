const //packages
    promise = require('bluebird'),
    _ = require('lodash'),
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
            req.checkBody('name').notEmpty();

            //can only create an account on the name step
            if (req.validationErrors() || req.body.action !== 'api-tp-welcome'){
                return promise.reject('api - account session creation - validation errors');
            } else {
                const taxProfileSession = req.session.taxProfile;
                taxProfileSession.users[0].name = req.body.name;
                taxProfileSession.currentPage = getCurrentPage(req.body.action);
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
                const taxProfileSession = req.session.taxProfile;
                taxProfileSession.users.forEach(function(entry) {
                    if (entry.hasOwnProperty('firstName')) {
                        entry.firstName = req.body.data[entry.id];
                    }
                });
                taxProfileSession.currentPage = getCurrentPage(req.body.action);
                req.session.taxProfile = taxProfileSession;
                return promise.resolve();
            }
        });
};

taxProfile.saveActiveTiles = function(req){
    return promise.resolve()
        .then(function() {
            const taxProfileSession = req.session.taxProfile;
            var group = getCurrentPage(req.body.action);
            //group nicename
            switch(group){
                case 'filing-for':
                    group = 'filingFor';
                    break;
                case '':
                    break;
            }
            //special actions
            if (group === 'filingFor'){
                _.forOwn(req.body.data, function(value, key) {
                    if (parseInt(key) === 9998){
                        //spouse
                        if (parseInt(value) === 1) {
                            if (!taxProfileSession.users[1].hasOwnProperty('id')){
                                taxProfileSession.users[1] = sessionModel.getTaxProfileUserObject();
                                taxProfileSession.users[1].id = taxProfileSession.users[0].id + '-spouse';
                            }
                        } else {
                            taxProfileSession.users[1] = {};
                        }
                    } else if (parseInt(key) === 9997){
                        //other
                        if (parseInt(value) === 1){
                            if (!taxProfileSession.users[2].hasOwnProperty('id')) {
                                taxProfileSession.users[2] = sessionModel.getTaxProfileUserObject();
                                taxProfileSession.users[2].id = taxProfileSession.users[0].id + '-other';
                            }
                        } else {
                            taxProfileSession.users[2] = {};
                        }
                    }
                });
            }
            //save active tiles
            taxProfileSession.users.forEach(function(entry) {
                if (entry.hasOwnProperty('activeTiles')) {
                    if (!entry.activeTiles.hasOwnProperty(group)) {
                        entry.activeTiles[group] = {};
                    }
                    _.forOwn(req.body.data, function (value, key) {
                        entry.activeTiles[group][key] = value;
                    });
                }
            });
            taxProfileSession.currentPage = getCurrentPage(req.body.action);
            req.session.taxProfile = taxProfileSession;
            return promise.resolve();
        });
};

module.exports = taxProfile;