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
    session.actionStartAccountSession(req);
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
        data: {}
    });
};

userPages.actionRegisterUser = function(req, res, next){
    session.actionStartAccountSession(req);
    res.status(util.http.status.accepted).json({
        action: 'register',
        result: 'success'
    });
};

/************ forgot password ************/
userPages.getForgotPasswordPage = function(req, res, next){
    res.render('user/forgot-password', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + 'Password Reset'
        },
        account: session.getAccountObject(req),
        data: {}
    });
};

userPages.actionForgotPassword = function(req, res, next){
    res.status(util.http.status.accepted).json({
        action: 'forgot password',
        status: 'success'
    });
};

/************ logout ************/

userPages.getLogoutPage = function(req, res, next) {
    session.actionDestroyAccountSession(req);
    res.redirect('/login');
};

userPages.actionLogoutUser = function(req, res, next) {
    session.actionDestroyAccountSession(req);
};

module.exports = userPages;