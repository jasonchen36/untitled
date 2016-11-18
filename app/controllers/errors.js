const //services
    util = require('../services/util'),
    session = require('../services/session');

var errorPages = {};

errorPages.get404Page = function(req, res, next){
    res.render('errors/404', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + '404 Not Found'
        },
        globals: util.getGlobalObject(),
        account: session.getAccountObject(req),
        data: {},
        layout: 'layout-error'
    });
};

errorPages.get500Page = function(req, res, next){
    res.render('errors/500', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + '500 Error'
        },
        globals: util.getGlobalObject(),
        account: session.getAccountObject(req),
        data: {},
        layout: 'layout-error'
    });
};

module.exports = errorPages;