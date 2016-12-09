const //packages
    requestPromise = require('request-promise'),
    promise = require('bluebird'),
    moment = require('moment'),
    //models
    sessionModel = require('../models/session'),
//services
    errors = require('./errors'),
    session = {};

/************ tax profile ************/
session.actionStartTaxProfileSession = function(req){
    return session.actionDestroyTaxProfileSession(req)
        .then(function(){
            //validate
            req.checkBody('name').notEmpty();

            //can only create a tax profile on the name step
            if (req.validationErrors() || req.body.action !== 'api-tp-welcome'){
                return promise.reject('api - tax profile session creation - validation errors');
            }
        })
        .then(function(){
            //create account
            const options = {
                method: 'POST',
                uri: process.env.API_URL+'/account',
                body: {
                    name: req.body.name,
                    productId: process.env.API_PRODUCT_ID
                },
                json: true
            };
            return requestPromise(options)
                .then(function (response) {
                    try {
                        req.session.taxProfile = sessionModel.getTaxProfileObject(response);
                        return promise.resolve();
                    } catch(error){
                        if(!error){
                            error = 'Could not create tax profile';
                        }
                        return promise.reject(error);
                    }
                })
                .catch(function (response) {
                    var error = response;
                    if (response && response.hasOwnProperty('error')){
                        error = response.error;
                    }
                    return promise.reject(error);
                });
        });
};

session.hasTaxProfileSession = function(req){
    return promise.resolve()
        .then(function(){
            if (req.session.hasOwnProperty('taxProfile') && session.getTaxProfileValue(req,'hasTaxProfileSession')){
                if (moment().isBefore(session.getTaxProfileValue(req,'expiry'))){
                    return true;
                } else {
                    return session.actionDestroyTaxProfileSession(req)
                        .then(function(){
                            return false;
                        });
                }
            } else {
                return false;
            }
        });
};

session.actionDestroyTaxProfileSession = function(req){
    return promise.resolve()
        .then(function(){
            req.session.taxProfile = {};
        });
};

session.getTaxProfileObject = function(req){
    return req.session.hasOwnProperty('taxProfile')?req.session.taxProfile:{};
};

session.getTaxProfileValue = function(req, key){
    const taxProfileSession = session.getTaxProfileObject(req);
    return taxProfileSession.hasOwnProperty(key)?taxProfileSession[key]:'';
};


/************ user ************/
session.actionStartUserSession = function(req,token){
    return session.actionDestroyUserSession(req)
        .then(function(){
            //get user object
            const options = {
                method: 'GET',
                uri: process.env.API_URL+'/users/me',
                headers: {
                    'Authorization': 'Bearer '+token
                },
                body: {
                    name: req.body.name,
                    productId: process.env.API_PRODUCT_ID
                },
                json: true
            };
            return requestPromise(options)
                .then(function (response) {
                    try {
                        response.token = token;
                        req.session.user = sessionModel.getUserObject(response);
                        return promise.resolve();
                    } catch(error){
                        if(!error){
                            error = 'Could not create user account';
                        }
                        return promise.reject(error);
                    }
                })
                .catch(function (response) {
                    var error = response;
                    if (response && response.hasOwnProperty('error')){
                        error = response.error;
                    }
                    return promise.reject(error);
                });
        });
};

session.hasUserSession = function(req){
    return promise.resolve()
        .then(function() {
            if (req.session.hasOwnProperty('user') && session.getUserValue(req,'hasUserSession')){
                if (moment().isBefore(session.getUserValue(req,'expiry'))){
                    return true;
                } else {
                    return session.actionDestroyUserSession(req)
                        .then(function(){
                            return false;
                        });
                }
            } else {
                return false;
            }
        });
};

session.getUserObject = function(req){
    return req.session.hasOwnProperty('user') ? req.session.user : {};
};

session.actionDestroyUserSession = function(req){
    return session.actionDestroyTaxProfileSession(req)
        .then(function() {
            req.session.user = {};
        });
};

session.getUserValue = function(req, key){
    const userSession = session.getUserObject(req);
    return userSession.hasOwnProperty(key) ? userSession[key] : '';
};


module.exports = session;