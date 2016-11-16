const //services
    util = require('../services/util'),
    session = require('../services/session');

var taxReturnPrefix = 'Question ',
    taxReturnPages = {};

taxReturnPages.getPage1 = function(req, res, next){
    res.render('tax_return/page1', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + taxReturnPrefix + '1'
        },
        account: session.getAccountObject(req),
        data: {}
    });
};

taxReturnPages.getPage2 = function(req, res, next){
    res.render('tax_return/page2', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + taxReturnPrefix + '2'
        },
        account: session.getAccountObject(req),
        data: {}
    });
};

taxReturnPages.getPage3 = function(req, res, next){
    res.render('tax_return/page3', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + taxReturnPrefix + '3'
        },
        account: session.getAccountObject(req),
        data: {}
    });
};

module.exports = taxReturnPages;