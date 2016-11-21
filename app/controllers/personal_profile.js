const //services
    bookshelf = require('../services/bookshelf'),
    util = require('../services/util'),
    session = require('../services/session');

var personalProfilePages = {};

/************ personal profile ************/
personalProfilePages.getPersonalProfilePage = function(req, res, next){
    res.render('personal_profile/personal_profile', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + 'Personal Profile'
        },
        account: session.getAccountObject(req),
        user: session.getUserObject(req),
        data: {}
    });
};

module.exports = personalProfilePages;