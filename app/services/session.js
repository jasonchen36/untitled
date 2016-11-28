const //packages
    requestPromise = require('request-promise'),
    promise = require('bluebird'),
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
            if (req.validationErrors() || req.body.action !== 'api-tp-name'){
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
                        //todo, add expiry timestamp 1 week
                        req.session.account = {
                            hasAccountSession: true,
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
    //todo, timestamp validation
    return promise.resolve()
        .then(function(){
            return req.session.hasOwnProperty('account') && req.session.account.hasOwnProperty('hasAccountSession') && req.session.account.hasAccountSession;
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
    //todo, add expiry timestamp 1 hour
    //todo, get full user object
    return session.actionDestroyUserSession(req)
        .then(function(){
            req.session.user = {
                hasUserSession: true,
                token: token
            };
        });
};

session.hasUserSession = function(req){
    //todo, timestamp validation
    return promise.resolve()
        .then(function() {
            return req.session.hasOwnProperty('user') && req.session.user.hasOwnProperty('hasUserSession') && req.session.user.hasUserSession;
        });
};

session.getUserObject = function(req){
    return req.session.hasOwnProperty('user') ? req.session.user : {};
};

session.actionDestroyUserSession = function(req){
    return promise.resolve()
        .then(function() {
            req.session.user = {};
        });
};

session.getUserValue = function(req, key){
    const userSession = session.getUserObject(req);
    return userSession.hasOwnProperty(key) ? userSession[key] : '';
};

module.exports = session;