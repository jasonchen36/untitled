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
                globals: util.getGlobalObject(),
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
        globals: util.getGlobalObject(),
        account: session.getAccountObject(req),
        data: {}
    });
};

userPages.actionRegisterUser = function(req, res, next){
    session.actionStartUserSession(req);
    res.status(util.http.status.accepted).json({
        action: 'register',
        result: 'success'
    });
};

/************ forgot password ************/
userPages.getForgotPasswordPage = function(req, res, next){
    res.render('user/password-reset', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + 'Password Reset'
        },
        globals: util.getGlobalObject(),
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

/************ dashboard ************/
userPages.getDashboardPage = function(req, res, next){
    res.render('user/dashboard', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + 'Dashboard'
        },
        globals: util.getGlobalObject(),
        account: session.getAccountObject(req),
        data: {}
    });
};

module.exports = userPages;