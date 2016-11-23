const //packages
    requestPromise = require('request-promise'),
//services
    util = require('../services/util'),
    session = require('../services/session'),
    errors = require('../services/errors'),
    taxProfile = require('../services/tax_profile');

var userPages = {};

/************ login ************/
userPages.getLoginPage = function(req, res, next){
    res.render('user/login', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix+'Sign In'
        },
        account: session.getAccountObject(req),
        user: session.getUserObject(req),
        data: {}
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
                //todo, store token
                res.status(util.http.status.accepted).json({
                    action: 'login',
                    status: 'success'
                });
            })
            .catch(function (response) {
                next(new errors.BadRequestError(response.error,true));
            });
    }
};

/************ register ************/
userPages.getRegisterPage = function(req, res, next){
    res.render('user/register', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + 'Register'
        },
        account: session.getAccountObject(req),
        user: session.getUserObject(req),
        data: {}
    });
};

userPages.actionRegisterUser = function(req, res, next){
    req.checkBody('action').notEmpty();
    req.checkBody('password').notEmpty();
    req.checkBody('email').notEmpty();

    if (req.validationErrors() || req.body.action !== 'api-register'){
        next(new errors.BadRequestError('register - validation errors',true));
    } else {
        const options = {
            method: 'POST',
            uri: process.env.API_URL+'/users',
            body: {
                password: req.body.password,
                first_name: taxProfile.getValue(req,'name'),
                last_name: '',//not entered until person profile section
                email: req.body.email,
                accountId: taxProfile.getValue(req,'id')
            },
            json: true
        };
        requestPromise(options)
            .then(function (response) {
                //todo, store token
                res.status(util.http.status.accepted).json({
                    action: 'register',
                    status: 'success'
                });
            })
            .catch(function (response) {
                next(new errors.BadRequestError(response.error,true));
            });
    }
};

/************ password reset ************/
userPages.getPasswordResetPage = function(req, res, next){
    res.render('user/password-reset', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + 'Password Reset'
        },
        account: session.getAccountObject(req),
        user: session.getUserObject(req),
        data: {}
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
                next(new errors.BadRequestError(response.error,true));
            });
    }
};

userPages.getAuthorizedPasswordResetPage = function(req, res, next){
    res.render('user/password-reset-authorized', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + 'Password Reset'
        },
        account: session.getAccountObject(req),
        user: session.getUserObject(req),
        data: {
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
                next(new errors.BadRequestError(response.error,true));
            });
    }
};

/************ logout ************/
userPages.getLogoutPage = function(req, res, next) {
    session.actionDestroyUserSession(req);
    res.redirect('/login');
};

userPages.actionLogoutUser = function(req, res, next) {
    session.actionDestroyUserSession(req);
    res.status(util.http.status.ok).json({
        action: 'logout',
        status: 'success'
    });
};

module.exports = userPages;