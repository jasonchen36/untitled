const //packages
    requestPromise = require('request-promise'),
    promise = require('bluebird'),
    moment = require('moment'),
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
                        req.session.taxProfile = {
                            hasTaxProfileSession: true,
                            expiry: moment().add(7, 'days'),//todo, refresh expiry upon update
                            currentPage: 'welcome',
                            id: response.accountId,
                            firstName: response.name,
                            activeTiles: {}
                        };
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
            if (req.session.hasOwnProperty('account') && session.getTaxProfileValue(req,'hasAccountSession')){
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
                        req.session.user = {
                            hasUserSession: true,
                            token: token,
                            expiry: moment().add(1, 'hour'),//todo, refresh expiry upon update
                            id: response.id,
                            role: response.role,
                            provider: response.provider,
                            firstName: response.name && response.name.length > 0?response.name:response.first_name,
                            email: response.email,
                            phone: response.phone,
                            username: response.username,
                            lastName: response.last_name,
                            accounts: response.accounts,
                            birthday: response.birthday,
                            resetKey: response.reset_key,
                            accountId: response.account_id
                        };
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


/************ personal profile ************/

session.actionStartPersonalProfileSession = function(req){
    return session.actionDestroyPersonalProfileSession(req)
        .then(function(){
            req.session.personalProfile = {
                hasPersonalProfileSession: true,
                expiry: moment().add(7, 'days'),//todo, refresh expiry upon update
                activeTiles: {}
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