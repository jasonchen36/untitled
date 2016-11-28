const //services
    util = require('../services/util'),
    session = require('../services/session');

var dashboardPages = {};

/************ dashboard ************/
dashboardPages.getDashboardPage = function(req, res, next){
    const userObject = session.getUserObject(req);
    res.render('dashboard/dashboard', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + 'Dashboard'
        },
        account: session.getAccountObject(req),
        user: userObject,
        locals: {
            userToString: JSON.stringify(userObject)
        }
    });
};

module.exports = dashboardPages;