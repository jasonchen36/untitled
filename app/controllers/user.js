const //packages
    requestPromise = require('request-promise'),
//services
    util = require('../services/util'),
    session = require('../services/session'),
    errors = require('../services/errors');

var userPages = {};

/************ login ************/
userPages.getLoginPage = function(req, res, next){
    res.render('user/login', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix+'Sign In'
        },
        account: session.getTaxProfileSession(req),
        user: session.getUserProfileSession(req),
        locals: {}
    });
};

userPages.actionLoginUser = function(req, res, next){
    req.checkBody('action').notEmpty();
    req.checkBody('password').notEmpty();
    req.checkBody('email').notEmpty();

    if (req.validationErrors() || req.body.action !== 'api-login'){
        next(new errors.BadRequestError('login - validation errors',true));
    } else {
        const options = {
            method: 'POST',
            uri: process.env.API_URL+'/login',
            body: {
                password: req.body.password,
                email: req.body.email
            },
            json: true
        };
        requestPromise(options)
            .then(function (response) {
                try{
                    const responseToken = response.token;
                    session.actionStartUserProfileSession(req,responseToken)
                        .then(function(){
                            res.status(util.http.status.accepted).json({
                                action: 'login',
                                status: 'success'
                            });
                        });
                } catch(error){
                    if (!error){
                        error = 'Could not start user session';
                    }
                    next(new errors.InternalServerError(error,true));
                }
            })
            .catch(function (response) {
                var error = response;
                if (response && response.hasOwnProperty('error')){
                    error = response.error;
                }
                next(new errors.BadRequestError(error,true));
            });
    }
};

/************ register ************/
userPages.getRegisterPage = function(req, res, next){
    res.render('user/register', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + 'Register'
        },
        account: session.getTaxProfileSession(req),
        user: session.getUserProfileSession(req),
        locals: {}
    });
};

userPages.actionRegisterUser = function(req, res, next){
    req.checkBody('action').notEmpty();
    req.checkBody('password').notEmpty();
    req.checkBody('email').notEmpty();

    if (req.validationErrors() || req.body.action !== 'api-register'){
        next(new errors.BadRequestError('register - validation errors',true));
    } else {
        const taxProfileSession = session.getTaxProfileSession(req),
            options = {
            method: 'POST',
            uri: process.env.API_URL+'/users',
            body: {
                password: req.body.password,
                first_name: taxProfileSession.users[0].firstName,
                last_name: ' ',//not entered until person profile section
                email: req.body.email,
                accountId: taxProfileSession.users[0].id
            },
            json: true
        };
        requestPromise(options)
            .then(function (response) {
                try{
                    const responseToken = response.token;
                    session.actionStartUserProfileSession(req,responseToken)
                        .then(function(){
                            res.status(util.http.status.accepted).json({
                                action: 'register',
                                status: 'success'
                            });
                        });
                } catch(error){
                    if (!error){
                        error = 'Could not start user session';
                    }
                    next(new errors.InternalServerError(error,true));
                }
            })
            .catch(function (response) {
                var error = response;
                if (response && response.hasOwnProperty('error')){
                    error = response.error;
                }
                next(new errors.BadRequestError(error,true));
            });
    }
};

/************ password reset ************/
userPages.getPasswordResetPage = function(req, res, next){
    res.render('user/password-reset', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + 'Password Reset'
        },
        account: session.getTaxProfileSession(req),
        user: session.getUserProfileSession(req),
        locals: {}
    });
};

userPages.actionPasswordReset = function(req, res, next){
    req.checkBody('action').notEmpty();
    req.checkBody('email').notEmpty();

    if (req.validationErrors() || req.body.action !== 'api-password-reset'){
        next(new errors.BadRequestError('password reset - validation errors',true));
    } else {
        const options = {
            method: 'PUT',
            uri: process.env.API_URL+'/users/reset',
            body: {
                email: req.body.email
            },
            json: true
        };
        requestPromise(options)
            .then(function () {
                res.status(util.http.status.accepted).json({
                    action: 'password reset',
                    status: 'success'
                });
            })
            .catch(function (response) {
                var error = response;
                if (response && response.hasOwnProperty('error')){
                    error = response.error;
                }
                next(new errors.BadRequestError(error,true));
            });
    }
};

userPages.getAuthorizedPasswordResetPage = function(req, res, next){
    res.render('user/password-reset-authorized', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + 'Password Reset'
        },
        account: session.getTaxProfileSession(req),
        user: session.getUserProfileSession(req),
        locals: {
            token: req.params.token
        }
    });
};

userPages.actionAuthorizedPasswordReset = function(req, res, next){
    req.checkBody('password').notEmpty();

    if (req.validationErrors() || req.body.action !== 'api-authorized-password-reset'){
        next(new errors.BadRequestError('authorized password reset - validation errors',true));
    } else {
        const options = {
            method: 'PUT',
            uri: process.env.API_URL+'/users/reset/'+req.body.token,
            body: {
                password: req.body.password
            },
            json: true
        };
        requestPromise(options)
            .then(function () {
                res.status(util.http.status.accepted).json({
                    action: 'authorized password reset',
                    status: 'success'
                });
            })
            .catch(function (response) {
                var error = response;
                if (response && response.hasOwnProperty('error')){
                    error = response.error;
                }
                next(new errors.BadRequestError(error,true));
            });
    }
};

/************ logout ************/
userPages.getLogoutPage = function(req, res, next) {
    session.actionDestroyUserProfileSession(req)
        .then(function(){
            res.redirect('/login');
        });
};

userPages.actionLogoutUser = function(req, res, next) {
    session.actionDestroyUserProfileSession(req)
        .then(function(){
            res.status(util.http.status.ok).json({
                action: 'logout',
                status: 'success'
            });
        });
};

module.exports = userPages;