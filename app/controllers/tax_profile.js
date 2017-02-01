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
    var filingForRequest = _.clone(requestObject, true),
        quoteRequest = _.clone(requestObject, true);
    filingForRequest.uri += util.questionCategories.filingFor;
    quoteRequest.uri += util.questionCategories.quote;
    promise.all([
        requestPromise(filingForRequest),
        requestPromise(quoteRequest)
    ])
        .then(function (response) {
            const taxProfileQuestions = {
                    filingFor: response[0],
                    quoteApplies: response[1]
                };

               var dataObject = session.getUserProfileSession(req);

                if(typeof dataObject === 'undefined'  || typeof  dataObject.hasUserProfileSession  === 'undefined')
                {
                    dataObject = session.getTaxProfileSession(req);
                    console.log(JSON.stringify( dataObject ));

                 } 
            try {
                res.render('tax_profile/tax_profile', {
                    layout: 'layout-questionnaire',
                    meta: {
                        pageTitle: util.globals.metaTitlePrefix + 'Tax Profile'
                    },
                    data: dataObject,
                    locals: {
                        taxProfileToString: JSON.stringify(dataObject),
                        taxProfileQuestionsToString: JSON.stringify(taxProfileQuestions)
                    }
                });
            } catch(error){
                next(new errors.InternalServerError(error));
            }
        })
        .catch(function (response) {
            var error = response;
            if (response && response.hasOwnProperty('error')){
                error = response.error;
            }
            next(new errors.InternalServerError(error));
        });
};

taxReturnPages.actionSaveTaxProfile = function(req, res, next) {
    req.checkBody('action').notEmpty();

    if (req.validationErrors()){
        return promise.reject('api - tax profile - validation errors');
    } else {
        session.hasTaxProfileSession(req)
            .then(function (hasSession) {
                //check if session is initiated
                if (!hasSession) {
                    return session.actionStartTaxProfileSession(req);
                }
            })
            .then(function () {
                //save account to session
                switch (req.body.action) {
                    case 'api-tp-welcome':
                        return taxProfile.saveName(req);
                        break;
                    case 'api-tp-filers-names':
                        return taxProfile.saveFilersNames(req);
                        break;
                    case 'api-tp-filing-for':
                    case 'api-tp-quote-applies':
                        return taxProfile.saveActiveTiles(req);
                        break;
                    default:
                        return promise.reject('tax profile - invalid action');
                        break;
                }
            })
            .then(function(){
                //get quote if moving to quote page
                if (req.body.action === 'api-tp-quote-applies') {
                    return taxProfile.getTaxReturnQuote(req);
                }
            })
            .then(function () {
                //success
                res.status(util.http.status.accepted).json({
                    action: req.body.action,
                    status: 'success',
                    data: session.getTaxProfileSession(req)
                });
            })
            .catch(function (error) {
                if (!error) {
                    error = 'Could not save account';
                }
                next(new errors.BadRequestError(error, true));
            });
    }
};


/************ logout ************/
taxReturnPages.getLogoutPage = function(req, res, next){
    session.actionDestroyTaxProfileSession(req)
        .then(function(){
                res.redirect('/tax-profile');
        });
};

module.exports = taxReturnPages;
