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
            req.checkBody('firstName').notEmpty();

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
                    name: req.body.firstName,
                    productId: process.env.API_PRODUCT_ID
                },
                json: true
            };
            return requestPromise(options)
                .then(function (response) {
                    try {
                        session.setTaxProfileSession(req, sessionModel.getTaxProfileObject(response));
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
            session.setTaxProfileSession(req, {});
        });
};

session.getTaxProfileSession = function(req){
    return req.session.hasOwnProperty('taxProfile')?req.session.taxProfile:{};
};

session.setTaxProfileSession = function(req, data){
    return req.session.taxProfile = data;
};

session.getTaxProfileValue = function(req, key){
    const taxProfileSession = session.getTaxProfileSession(req);
    return taxProfileSession.hasOwnProperty(key)?taxProfileSession[key]:'';
};


/************ user ************/
session.actionStartUserProfileSession = function(req, token){
    return session.actionDestroyUserProfileSession(req)
        .then(function(){
            //get user object
            const options = {
                method: 'GET',
                uri: process.env.API_URL+'/users/me',
                headers: {
                    'Authorization': 'Bearer '+token
                },
                body: {
                    name: req.body.firstName,
                    productId: process.env.API_PRODUCT_ID
                },
                json: true
            };



            return requestPromise(options)
                .then(function (response) {
                    try {
                        response.token = token;
                        req.session.userProfile = sessionModel.getUserProfileObject(response);
                        var accountID = (req.session.userProfile.users[0].accountId);
                        const getAccountOptions = {
                            method: 'GET',
                            uri: process.env.API_URL+'/account/'+accountID,
                            headers: {
                                'Authorization': 'Bearer '+token
                            },
                            body: {
                                name: req.body.firstName,
                                productId: process.env.API_PRODUCT_ID
                            },
                            json: true
                        };

                        requestPromise(getAccountOptions)
                            .then(function (response) {
                                try {
                                    req.session.userProfile = sessionModel.getUserTaxReturns(response);
                                    return promise.resolve();
                                } catch(error){
                                    if(!error){
                                        error = 'Could not create user account';
                                    }
                                    return promise.reject(error);
                                }
                            });


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

session.hasUserProfileSession = function(req){
    return promise.resolve()
        .then(function() {
            if (req.session.hasOwnProperty('userProfile') && session.getUserProfileValue(req,'hasUserProfileSession')){
                if (moment().isBefore(session.getUserProfileValue(req,'expiry'))){
                    return true;
                } else {
                    return session.actionDestroyUserProfileSession(req)
                        .then(function(){
                            return false;
                        });
                }
            } else {
                return false;
            }
        });
};

session.getUserProfileSession = function(req){
    return req.session.hasOwnProperty('userProfile') ? req.session.userProfile : {};
};

session.setUserProfileSession = function(req, data){
    return req.session.userProfile = data;
};

session.actionDestroyUserProfileSession = function(req){
    return session.actionDestroyTaxProfileSession(req)
        .then(function() {
            session.setUserProfileSession(req, {});
        });
};

session.getUserProfileValue = function(req, key){
    const userSession = session.getUserProfileSession(req);
    return userSession.hasOwnProperty(key) ? userSession[key] : '';
};


module.exports = session;