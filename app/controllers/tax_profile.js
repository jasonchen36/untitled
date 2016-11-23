const //packages
    requestPromise = require('request-promise'),
    promise = require('bluebird'),
//services
    util = require('../services/util'),
    session = require('../services/session'),
    taxProfile = require('../services/tax_profile'),
    errors = require('../services/errors');

var taxReturnPages = {};

/************ tax profile ************/
taxReturnPages.getPageTaxProfile = function(req, res, next){
    res.render('tax_profile/tax_profile', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + 'Tax Profile'
        },
        account: session.getAccountObject(req),
        user: session.getUserObject(req),
        data: {}
    });
};

taxReturnPages.actionSaveAccount = function(req, res, next) {
    promise.resolve()
        .then(function(){
            //check if session is initiated
            if (!session.hasAccountSession(req)){
                return session.actionStartAccountSession(req);
            }
        })
        .then(function(){
            //save session
            switch(req.body.action){
                //todo, communicate with api
                case 'api-tp-name':
                    return taxProfile.saveName(req);
                    break;
                case 'api-tp-filingType':
                    return taxProfile.saveFilingType(req);
                    break;
                default:
                    return next(new errors.BadRequestError('tax profile - invalid action'));
                    break;
            }
        })
        .then(function(){
            //success
            res.status(util.http.status.accepted).json({
                action: req.body.action,
                status: 'success',
                data: session.getAccountObject(req)
            });
        })
        .catch(function(err){
            next(new errors.BadRequestError(err));
        });
};



/************ logout ************/
taxReturnPages.getLogoutPage = function(req, res, next){
    session.actionDestroyAccountSession(req);
    res.redirect('/tax-profile');
};

module.exports = taxReturnPages;