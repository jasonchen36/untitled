const //services
    util = require('../services/util'),
    session = require('../services/session');

var taxReturnPrefix = 'Tax Profile | Page ',
    taxReturnPages = {};

/************ page one ************/
taxReturnPages.getPageOne = function(req, res, next){
    res.render('tax_profile/page-one', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + taxReturnPrefix + '1'
        },
        account: session.getAccountObject(req),
        user: session.getUserObject(req),
        data: {}
    });
};

taxReturnPages.actionPageOne = function(req, res, next) {
    //todo, communicate with api
    session.actionStartAccountSession(req);
    const accountName = req.body.name;
    req.session.account['name'] = accountName;
    res.status(util.http.status.accepted).json({
        action: 'profile 1',
        status: 'success'
    });
};

/************ page two ************/
taxReturnPages.getPageTwo = function(req, res, next){
    res.render('tax_profile/page-two', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + taxReturnPrefix + '2'
        },
        account: session.getAccountObject(req),
        user: session.getUserObject(req),
        data: {}
    });
};

/************ page three ************/
taxReturnPages.getPageThree = function(req, res, next){
    res.render('tax_profile/page-three', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + taxReturnPrefix + '3'
        },
        account: session.getAccountObject(req),
        user: session.getUserObject(req),
        data: {}
    });
};

/************ page four ************/
taxReturnPages.getPageFour = function(req, res, next){
    res.render('tax_profile/page-four', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + taxReturnPrefix + '4'
        },
        account: session.getAccountObject(req),
        user: session.getUserObject(req),
        data: {}
    });
};

/************ page five ************/
taxReturnPages.getPageFive = function(req, res, next){
    res.render('tax_profile/page-five', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + taxReturnPrefix + '5'
        },
        account: session.getAccountObject(req),
        user: session.getUserObject(req),
        data: {}
    });
};

/************ page six ************/
taxReturnPages.getPageSix = function(req, res, next){
    res.render('tax_profile/page-six', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + taxReturnPrefix + '6'
        },
        account: session.getAccountObject(req),
        user: session.getUserObject(req),
        data: {}
    });
};

taxReturnPages.getPageSeven = function(req, res, next){
    res.render('tax_profile/page-seven', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + taxReturnPrefix + '7'
        },
        account: session.getAccountObject(req),
        user: session.getUserObject(req),
        data: {}
    });
};

/************ page quote ************/
taxReturnPages.getPageQuote = function(req, res, next){
    res.render('tax_profile/quote', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + 'Tax Profile | Quote'
        },
        account: session.getAccountObject(req),
        user: session.getUserObject(req),
        data: {}
    });
};

/************ logout ************/
taxReturnPages.getLogoutPage = function(req, res, next){
    session.actionDestroyAccountSession(req);
    res.redirect('/tax-profile');
};

module.exports = taxReturnPages;