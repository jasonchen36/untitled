const //packages
    promise = require('bluebird'),
    _ = require('lodash'),
    //services
    util = require('./util'),
    session = require('./session');

var user = {};

function getCurrentPage(action){
    return action.split('api-pp-')[1];
}

user.saveLastName = function(req){
    return promise.resolve()
        .then(function(){
            //validate
            req.checkBody('lastName').notEmpty();

            //can only create an user profile on the name step
            if (req.validationErrors() || req.body.action !== 'api-pp-last-name'){
                return promise.reject('api - user session creation - validation errors');
            } else {
                req.session.user.lastName = req.body.lastName;
                req.session.user.currentPage = getCurrentPage(req.body.action);
                return promise.resolve();
            }
        });
};

user.saveActiveTiles = function(req, group){
    return promise.resolve()
        .then(function() {
            if (!req.session.user.activeTiles.hasOwnProperty(group)){
                req.session.user.activeTiles[group] = {};
            }
            _.forOwn(req.body.data, function(value, key) {
                req.session.user.activeTiles[group][key] = value;
            });
            req.session.user.currentPage = getCurrentPage(req.body.action);
            return promise.resolve();
        });
};

module.exports = user;