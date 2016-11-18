const //services
    util = require('../services/util'),
    session = require('../services/session');

var authenticationMiddleware = {};

authenticationMiddleware.redirectWithoutAccountSession = function(req, res, next){
    if (session.getAccountSession(req)){
        next();
    } else {
        res.redirect('/login');
    }
};

authenticationMiddleware.redirectWithUserSession = function(req, res, next){
    if (session.getAccountSession(req)){
        res.redirect('/dashboard');
    } else {
        next();
    }
};

module.exports = authenticationMiddleware;