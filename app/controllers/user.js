const //services
    bookshelf = require('../services/bookshelf'),
    util = require('../services/util'),
    session = require('../services/session');

var userPages = {};

/************ login ************/
userPages.getLoginPage = function(req, res, next){
    var User = bookshelf.Model.extend({
        tableName: 'users'
    });

    User.where('id', 1)
        .fetch()
        .then(function(user) {
            // Update views
            req.session.views = (req.session.views || 0) + 1;

            res.render('user/login', {
                meta: {
                    pageTitle: util.globals.metaTitlePrefix+'Sign In'
                },
                account: session.getAccountObject(req),
                user: session.getUserObject(req),
                data: {
                    name: user.toJSON().name,
                    views: req.session.views
                }
            });
        })
        .catch(function(error) {
            next(error);
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
    //todo, communicate with api
    res.status(util.http.status.accepted).json({
        action: 'password reset',
        status: 'success'
    });
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