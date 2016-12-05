const //packages
    _ = require('lodash'),
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
    const requestObject = {
        method: 'GET',
        uri: process.env.API_URL+'/questions/product/'+process.env.API_PRODUCT_ID+'/category/',
        body: {},
        json: true
    };
    var incomeRequest = _.clone(requestObject, true),
        creditsRequest = _.clone(requestObject, true),
        deductionsRequest = _.clone(requestObject, true);
    incomeRequest.uri = incomeRequest.uri+util.questionCategories.income;
    creditsRequest.uri += util.questionCategories.credits;
    deductionsRequest.uri += util.questionCategories.deductions;
    promise.all([
        requestPromise(incomeRequest),
        requestPromise(creditsRequest),
        requestPromise(deductionsRequest)
    ])
        .then(function (response) {
            const taxProfileQuestions = {
                income: response[0],
                credits: response[1],
                deductions: response[2]
            };
            try {
                res.render('tax_profile/tax_profile', {
                    layout: 'layout-questionnaire',
                    meta: {
                        pageTitle: util.globals.metaTitlePrefix + 'Tax Profile'
                    },
                    account: session.getAccountObject(req),
                    user: session.getUserObject(req),
                    taxProfileQuestions: taxProfileQuestions,
                    locals: {
                        accountToString: JSON.stringify(session.getAccountObject(req)),
                        taxProfileQuestionsToString: JSON.stringify(taxProfileQuestions)
                    }
                });
            } catch(error){
                console.log(error);
                next(new errors.InternalServerError(error));
            }
        })
        .catch(function (error) {
            if (!error){
                error = 'Could not retrieve questions'
            }
            next(new errors.InternalServerError(error));
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
                case 'api-tp-welcome':
                    return taxProfile.saveName(req);
                    break;
                case 'api-tp-filing-for':
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
                data: session.getAccountObject(req)
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