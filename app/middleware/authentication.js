const //services
    util = require('../services/util');

var authenticationMiddleware = {};

authenticationMiddleware.isUserLoggedIn = function(req, res, next){
    if (req.session.user && req.session.user.isLoggedIn){
        //todo, add expiry timestamp and validation
        next();
    } else {
        res.redirect('/login');
    }
};

module.exports = authenticationMiddleware;