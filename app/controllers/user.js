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
        account: session.getAccountObject(req),
        user: session.getUserObject(req),
        data: {}
    });
};

userPages.actionLoginUser = function(req, res, next){
    //todo, communicate with api
    session.actionStartUserSession(req);
    res.status(util.http.status.ok).json({
        action: 'login',
        result: 'success'
    });
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
    //todo, communicate with api
    session.actionStartUserSession(req);
    res.status(util.http.status.accepted).json({
        action: 'register',
        result: 'success'
    });
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
    if (req.body.action !== 'api-password-reset'){
        next(new errors.BadRequestError('password reset'));
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
                next(new errors.BadRequestError(response.error));
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
    //todo, communicate with api
    res.status(util.http.status.accepted).json({
        action: 'authorized password reset',
        status: 'success'
    });
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