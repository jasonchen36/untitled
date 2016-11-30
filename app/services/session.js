const //packages
    requestPromise = require('request-promise'),
    promise = require('bluebird'),
    moment = require('moment'),
//services
    errors = require('./errors'),
    session = {};

/************ account ************/
session.actionStartAccountSession = function(req){
    return session.actionDestroyAccountSession(req)
        .then(function(){
            //validate
            req.checkBody('name').notEmpty();

            //can only create an account on the name step
            if (req.validationErrors() || req.body.action !== 'api-tp-welcome'){
                return promise.reject('api - account session creation - validation errors');
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
                        req.session.account = {
                            hasAccountSession: true,
                            expiry: moment().add(7, 'days'),
                            currentPage: 'welcome',
                            id: response.accountId,
                            name: response.name
                        };
                        return promise.resolve();
                    } catch(error){
                        if(!error){
                            error = 'Could not create account';
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

session.hasAccountSession = function(req){
    return promise.resolve()
        .then(function(){
            if (req.session.hasOwnProperty('account') && session.getAccountValue(req,'hasAccountSession')){
                if (moment().isBefore(session.getAccountValue(req,'expiry'))){
                    return true;
                } else {
                    return session.actionDestroyAccountSession(req)
                        .then(function(){
                            return false;
                        });
                }
            } else {
                return false;
            }
        });
};

session.actionDestroyAccountSession = function(req){
    return promise.resolve()
        .then(function(){
            req.session.account = {};
        });
};

session.getAccountObject = function(req){
    return req.session.hasOwnProperty('account')?req.session.account:{};
};

session.getAccountValue = function(req, key){
    const accountSession = session.getAccountObject(req);
    return accountSession.hasOwnProperty(key)?accountSession[key]:'';
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
                        req.session.user = {
                            hasUserSession: true,
                            token: token,
                            expiry: moment().add(1, 'hour'),
                            id: response.id,
                            role: response.role,
                            provider: response.provider,
                            name: response.name,
                            email: response.email,
                            phone: response.phone,
                            username: response.username,
                            firstName: response.first_name,
                            lastName: response.last_name,
                            accounts: response.accounts,
                            birthday: response.birthday,
                            resetKey: response.reset_key,
                            accountId: response.account_id
                        };
                        return promise.resolve();
                    } catch(error){
                        if(!error){
                            error = 'Could not create account';
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
    return session.actionDestroyAccountSession(req)
        .then(function() {
            req.session.user = {};
        });
};

session.getUserValue = function(req, key){
    const userSession = session.getUserObject(req);
    return userSession.hasOwnProperty(key) ? userSession[key] : '';
};


/************ personal profile ************/

session.actionStartPersonalProfileSession = function(req){
    return session.actionDestroyPersonalProfileSession(req)
        .then(function(){
            req.session.personalProfile = {
                hasPersonalProfileSession: true,
                expiry: moment().add(7, 'days')
            };
            return promise.resolve();
        });
};

session.hasPersonalProfileSession = function(req){
    return promise.resolve()
        .then(function() {
            if (req.session.hasOwnProperty('personalProfile') && session.getPersonalProfileValue(req,'hasPersonalProfileSession')){
                if (moment().isBefore(session.getPersonalProfileValue(req,'expiry'))){
                    return true;
                } else {
                    return session.actionDestroyPersonalProfileSession(req)
                        .then(function(){
                            return false;
                        });
                }
            } else {
                return false;
            }
        });
};

session.getPersonalProfileObject = function(req){
    return req.session.hasOwnProperty('personalProfile') ? req.session.personalProfile : {};
};

session.actionDestroyPersonalProfileSession = function(req){
    return promise.resolve()
        .then(function() {
            req.session.personalProfile = {};
        });
};

session.getPersonalProfileValue = function(req, key){
    const personalProfileSession = session.getPersonalProfileObject(req);
    return personalProfileSession.hasOwnProperty(key) ? personalProfileSession[key] : '';
};

module.exports = session;