const //packages
    _ = require('lodash'),
    promise = require('bluebird'),
    requestPromise = require('request-promise'),
//services
    util = require('../services/util'),
    session = require('../services/session'),
    errors = require('../services/errors');

var personalProfilePages = {};

/************ personal profile ************/
personalProfilePages.getPersonalProfilePage = function(req, res, next){
    const requestObject = {
        method: 'GET',
        uri: process.env.API_URL+'/questions/product/'+process.env.API_PRODUCT_ID+'/category/',
        body: {},
        json: true
    };

    const requestCategory = {
        method: 'GET',
        uri: process.env.API_URL+'/categories/11',
        body: {},
        json: true
    };

    var specialScenariosRequest = _.clone(requestObject, true),
        creditsRequest = _.clone(requestObject, true),
        deductionsRequest = _.clone(requestObject, true),
        incomeRequest = _.clone(requestObject, true),
        maritalStatusRequest = _.clone(requestObject, true),
        dependantsRequest = _.clone(requestObject, true);
    incomeRequest.uri += util.questionCategories.income;
    creditsRequest.uri += util.questionCategories.credits;
    deductionsRequest.uri += util.questionCategories.deductions;
    specialScenariosRequest.uri += util.questionCategories.specialScenarios;
    maritalStatusRequest.uri += util.questionCategories.maritalStatus;
    dependantsRequest.uri += util.questionCategories.dependants;
    promise.all([
        requestPromise(incomeRequest),
        requestPromise(creditsRequest),
        requestPromise(deductionsRequest),
        requestPromise(specialScenariosRequest),
        requestPromise(maritalStatusRequest),
        requestPromise(dependantsRequest),
        requestPromise(requestCategory)
    ])
        .then(function (response) {
            const personalProfileQuestions = {
                    income: response[0],
                    credits: response[1],
                    deductions: response[2],
                    specialScenarios: response[3],
                    maritalStatus: response[4],
                    dependants: response[5]
                };

           var dataObject = session.getUserProfileSession(req);
            dataObject.categories = {};
            dataObject.categories.displaytext = response[6][0].displaytext;
            try {
                res.render('personal_profile/personal_profile', {
                    meta: {
                        pageTitle: util.globals.metaTitlePrefix + 'Personal Profile'
                    },
                    data: dataObject,
                    locals: {
                        personalProfileToString: JSON.stringify(dataObject),
                        personalProfileQuestionsToString: JSON.stringify(personalProfileQuestions)
                    },
                    layout: 'layout-questionnaire'
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

personalProfilePages.getPrivacyPage = function(req, res, next){
    res.render('user/privacy-policy', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix+'Privacy Policy'
        },
        account: session.getTaxProfileSession(req),
        user: session.getUserProfileSession(req),
        locals:
        {
            apiUrl: process.env.API_URL
        }
    });
};

personalProfilePages.getTermsPage = function(req, res, next){
    res.render('user/terms-and-conditions', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix+'Terms and Conditions'
        },
        account: session.getTaxProfileSession(req),
        user: session.getUserProfileSession(req),
        locals:
        {
            apiUrl: process.env.API_URL
        }
    });
};

module.exports = personalProfilePages;
