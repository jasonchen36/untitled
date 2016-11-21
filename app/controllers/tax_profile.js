const //services
    util = require('../services/util'),
    session = require('../services/session'),
    taxProfile = require('../services/tax_profile'),
    errorService = require('../services/errors');

var taxReturnPages = {};

/************ tax profile ************/
taxReturnPages.getPageTaxProfile = function(req, res, next){
    res.render('tax_profile/landing', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + 'Tax Profile'
        },
        account: session.getAccountObject(req),
        user: session.getUserObject(req),
        data: {}
    });
};

taxReturnPages.actionSaveAccount = function(req, res, next) {
    if (!session.hasAccountSession(req)){
        if (req.body.action !== 'name') {
            next(new errorService.BadRequestError('tax profile - no account session exists'));
        } else {
            session.actionStartAccountSession(req);
        }
    }
    switch(req.body.action){
        case 'name':
            taxProfile.saveName(req);
            break;
        case 'filingType':
            taxProfile.saveFilingType(req);
            break;
        default:
            next(new errorService.BadRequestError('tax profile - invalid action'));
            break;
    }
    res.status(util.http.status.accepted).json({
        action: req.body.action,
        status: 'success',
        data: session.getAccountObject(req)
    });
};



/************ logout ************/
taxReturnPages.getLogoutPage = function(req, res, next){
    session.actionDestroyAccountSession(req);
    res.redirect('/tax-profile');
};

module.exports = taxReturnPages;