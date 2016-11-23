const //packages
    requestPromise = require('request-promise'),
    promise = require('bluebird'),
//services
    errors = require('./errors'),
    session = {};

/************ account ************/
session.actionStartAccountSession = function(req){
    session.actionDestroyAccountSession(req);
    return promise.resolve()
        .then(function(){
            //validate
            req.checkBody('name').notEmpty();

            if (req.validationErrors() || req.body.action !== 'api-tp-name'){
                return promise.reject('api - account session creation - validation errors');
            }
        })
        .then(function(){
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
                    console.log('success',response);
                    //todo, store token
                    //todo, add expiry timestamp 1 week
                    req.session.account = {
                        hasAccountSession: true
                    };
                    return promise.resolve();
                })
                .catch(function (response) {
                    return promise.reject(response.error);
                });
        });
};

session.hasAccountSession = function(req){
    //todo, timestamp validation
    return req.session.account && req.session.account.hasAccountSession;
};

session.actionDestroyAccountSession = function(req){
    //todo, communicate with api
    req.session.account = {};
};

session.getAccountObject = function(req){
    return req.session.account;
};


/************ user ************/
session.actionStartUserSession = function(req){
    //todo, store account id in cookie
    //todo, add expiry timestamp 1 hour
    session.actionDestroyUserSession(req);
    req.session.user = {
        hasUserSession: true
    }
};

session.hasUserSession = function(req){
    //todo, timestamp validation
    return req.session.user && req.session.user.hasUserSession;
};

session.getUserObject = function(req){
    return req.session.user;
};

session.actionDestroyUserSession = function(req){
    //todo, communicate with api
    req.session.user = {};
};

module.exports = session;