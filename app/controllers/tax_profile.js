const //packages
    _ = require('lodash'),
    requestPromise = require('request-promise'),
    promise = require('bluebird'),
//services
    util = require('../services/util'),
    session = require('../services/session'),
    taxProfile = require('../services/tax_profile'),
    errors = require('../services/errors'),
//models
    questionsModel = require('../models/questions');

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
                    filingFor: questionsModel.getFilingForData(),
                    income: response[0],
                    credits: response[1],
                    deductions: response[2]
                },
                dataObject = session.getTaxProfileObject(req);
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
        .catch(function (error) {
            if (!error){
                error = 'Could not retrieve questions'
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
                //save account and qoute to session
                switch (req.body.action) {
                    case 'api-tp-welcome':
                        return taxProfile.saveName(req);
                        break;
                    case 'api-tp-filers-names':
                        return taxProfile.saveFilersNames(req);
                        break;
                    case 'api-tp-filing-for':
                        return taxProfile.saveActiveTiles(req);
                        break;
                    default:
                        return promise.reject('tax profile - invalid action');
                        break;
                }
            })
            .then(function () {
                //success
                res.status(util.http.status.accepted).json({
                    action: req.body.action,
                    status: 'success',
                    data: session.getTaxProfileObject(req)
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