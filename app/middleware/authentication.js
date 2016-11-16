const //services
    util = require('../services/util'),
    session = require('../services/session');

var authenticationMiddleware = {};

authenticationMiddleware.redirectWithoutSession = function(req, res, next){
    if (session.getUserLoggedIn(req)){
        next();
    } else {
        res.redirect('/login');
    }
};

authenticationMiddleware.redirectWithSession = function(req, res, next){
    if (session.getUserLoggedIn(req)){
        res.redirect('/questionnaire/page1');
    } else {
        next();
    }
};

module.exports = authenticationMiddleware;