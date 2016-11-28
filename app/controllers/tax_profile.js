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
        locals: {}
    });
};

taxReturnPages.actionSaveAccount = function(req, res, next) {
    session.hasAccountSession(req)
        .then(function(hasSession){
            //check if session is initiated
            if (!hasSession){
                return session.actionStartAccountSession(req);
            }
        })
        .then(function(){
            //save account and qoute to session
            switch(req.body.action){
                case 'api-tp-name':
                    return taxProfile.saveName(req);
                    break;
                case 'api-tp-filingType':
                    return taxProfile.saveFilingType(req);
                    break;
                default:
                    return promise.reject('tax profile - invalid action');
                    break;
            }
        })
        .then(function(){
            //todo, update account/quote in api
        })
        .then(function(){
            //success
            res.status(util.http.status.accepted).json({
                action: req.body.action,
                status: 'success',
                locals: session.getAccountObject(req)
            });
        })
        .catch(function(error){
            if(!error){
                error = 'Could not save account';
            }
            next(new errors.BadRequestError(error,true));
        });
};



/************ logout ************/
taxReturnPages.getLogoutPage = function(req, res, next){
    session.actionDestroyAccountSession(req)
        .then(function(){
            res.redirect('/tax-profile');
        });
};

module.exports = taxReturnPages;