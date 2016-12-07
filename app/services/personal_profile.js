const //packages
    promise = require('bluebird'),
    _ = require('lodash'),
//services
    session = require('./session'),
    util = require('./util'),
    personalProfile = {};

function getCurrentPage(action){
    return action.split('api-pp-')[1];
}

personalProfile.saveLastName = function(req){
    return promise.resolve()
        .then(function(){
            //validate
            req.checkBody('lastName').notEmpty();

            //can only create an personalProfile on the name step
            if (req.validationErrors() || req.body.action !== 'api-pp-last-name'){
                return promise.reject('api - personalProfile session creation - validation errors');
            } else {
                req.session.user.lastName = req.body.lastName;
                req.session.personalProfile.currentPage = getCurrentPage(req.body.action);
                return promise.resolve();
            }
        });
};

personalProfile.saveActiveTiles = function(req, group){
    return promise.resolve()
        .then(function() {
            if (!req.session.personalProfile.activeTiles.hasOwnProperty(group)){
                req.session.personalProfile.activeTiles[group] = {};
            }
            _.forOwn(req.body.data, function(value, key) {
                req.session.personalProfile.activeTiles[group][key] = value;
            });
            req.session.personalProfile.currentPage = getCurrentPage(req.body.action);
            return promise.resolve();
        });
};

personalProfile.getDataObject = function(req){
    return util.mergeObjects([
        session.getUserObject(req),//user
        session.getAccountObject(req),//account,
        session.getPersonalProfileObject(req)//personal profile
    ]);
};

module.exports = personalProfile;