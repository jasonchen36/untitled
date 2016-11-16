const //services
    util = require('../services/util'),
    session = require('../services/session');

var authenticationMiddleware = {};

authenticationMiddleware.isUserLoggedIn = function(req, res, next){
    if (session.getUserLoggedIn(req)){
        next();
    } else {
        res.redirect('/login');
    }
};

module.exports = authenticationMiddleware;