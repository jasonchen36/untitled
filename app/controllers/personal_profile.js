const //services
    util = require('../services/util'),
    session = require('../services/session');

var personalProfilePages = {};

/************ personal profile ************/
personalProfilePages.getPersonalProfilePage = function(req, res, next){
    //todo, if profile is complete, redirect to dashboard
    res.render('personal_profile/personal_profile', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + 'Personal Profile'
        },
        account: session.getAccountObject(req),
        user: session.getUserObject(req),
        personalProfile: session.getPersonalProfileObject(req),
        locals: {
            personalProfileToString: JSON.stringify(session.getPersonalProfileObject(req))
        },
        layout: 'layout-tax-profile'
    });
};

module.exports = personalProfilePages;