const //packages
    promise = require('bluebird'),
    _ = require('lodash'),
    moment = require('moment'),
    //services
    util = require('./util'),
    session = require('./session');

var personalProfile = {};

function getCurrentPage(action){
    return action.split('api-pp-')[1];
}

personalProfile.saveLastName = function(req){
    return promise.resolve()
        .then(function(){
            //validate
            req.checkBody('lastName').notEmpty();

            //can only create an user profile on the name step
            if (req.validationErrors() || req.body.action !== 'api-pp-last-name'){
                return promise.reject('api - user session creation - validation errors');
            } else {
                const userProfileSession = req.session.userProfile;
                userProfileSession.users[0].lastName = req.body.lastName;
                userProfileSession.currentPage = getCurrentPage(req.body.action);
                userProfileSession.expiry = moment().add(1, 'hour');//refresh after update
                req.session.userProfile = userProfileSession;
                return promise.resolve();
            }
        });
};

personalProfile.saveActiveTiles = function(req, group){
    return promise.resolve()
        .then(function() {
            const userProfileSession = req.session.userProfile;
            if (!userProfileSession.users[0].activeTiles.hasOwnProperty(group)){
                userProfileSession.users[0].activeTiles[group] = {};
            }
            _.forOwn(req.body.data, function(value, key) {
                userProfileSession.users[0].activeTiles[group][key] = value;
            });
            userProfileSession.currentPage = getCurrentPage(req.body.action);
            userProfileSession.expiry = moment().add(1, 'hour');//refresh after update
            req.session.userProfile = userProfileSession;
            return promise.resolve();
        });
};

module.exports = personalProfile;