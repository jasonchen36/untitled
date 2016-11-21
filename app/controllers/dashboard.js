const //services
    bookshelf = require('../services/bookshelf'),
    util = require('../services/util'),
    session = require('../services/session');

var dashboardPages = {};

/************ dashboard ************/
dashboardPages.getDashboardPage = function(req, res, next){
    res.render('dashboard/dashboard', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + 'Dashboard'
        },
        account: session.getAccountObject(req),
        user: session.getUserObject(req),
        data: {}
    });
};

module.exports = dashboardPages;