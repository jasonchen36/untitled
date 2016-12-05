const //packages
    promise = require('bluebird'),
    _ = require('lodash'),
//services
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
                req.session.account.name = req.body.name;
                req.session.account.currentPage = getCurrentPage(req.body.action);
                return promise.resolve();
            }
        });
};

taxProfile.saveActiveTiles = function(req, group){
    return promise.resolve()
        .then(function() {
            if (!req.session.account.activeTiles.hasOwnProperty(group)){
                req.session.account.activeTiles[group] = {};
            }
            _.forOwn(req.body.data, function(value, key) {
                req.session.account.activeTiles[group][key] = value;
            });
            req.session.account.currentPage = getCurrentPage(req.body.action);
            return promise.resolve();
        });
};

module.exports = taxProfile;