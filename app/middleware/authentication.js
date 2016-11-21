const //services
    util = require('../services/util'),
    session = require('../services/session');

var authenticationMiddleware = {};

/************ account session ************/
authenticationMiddleware.redirectWithoutAccountSession = function(req, res, next){
    if (session.hasAccountSession(req)){
        next();
    } else {
        res.redirect('/tax-profile');
    }
};

authenticationMiddleware.rejectWithoutAccountSession = function(req, res, next){
    if (session.hasAccountSession(req)){
        next();
    } else {
        res.status(util.http.status.unauthorized).json({
            action: 'unauthorized - no account session',
            status: 'failure'
        });
    }
};

/************ user session ************/
authenticationMiddleware.redirectWithUserSession = function(req, res, next){
    if (session.hasUserSession(req)){
        res.redirect('/dashboard');
    } else {
        next();
    }
};

authenticationMiddleware.redirectWithoutUserSession = function(req, res, next){
    if (session.hasUserSession(req)){
        next();
    } else {
        res.redirect('/login');
    }
};

authenticationMiddleware.rejectWithoutUserSession = function(req, res, next){
    if (session.hasUserSession(req)){
        next();
    } else {
        res.status(util.http.status.unauthorized).json({
            action: 'unauthorized - no user session',
            status: 'failure'
        });
    }
};


module.exports = authenticationMiddleware;