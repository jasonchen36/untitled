const //services
    util = require('../services/util'),
    session = require('../services/session');

var authenticationMiddleware = {};

authenticationMiddleware.redirectWithoutSession = function(req, res, next){
    if (session.getAccountSession(req)){
        next();
    } else {
        res.redirect('/login');
    }
};

authenticationMiddleware.redirectWithSession = function(req, res, next){
    if (session.getAccountSession(req)){
        res.redirect('/tax-return/page1');
    } else {
        next();
    }
};

module.exports = authenticationMiddleware;