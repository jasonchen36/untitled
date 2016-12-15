const //packages
    _ = require('lodash'),
    promise = require('bluebird'),
    requestPromise = require('request-promise'),
//services
    util = require('../services/util'),
    session = require('../services/session'),
    errors = require('../services/errors'),
    userProfile = require('../services/user_profile'),
//models
    questionsModel = require('../models/questions');

var personalProfilePages = {};

/************ personal profile ************/
personalProfilePages.getPersonalProfilePage = function(req, res, next){
    //todo, if profile is complete, redirect to dashboard
    const requestObject = {
        method: 'GET',
        uri: process.env.API_URL+'/questions/product/'+process.env.API_PRODUCT_ID+'/category/',
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
        requestPromise(dependantsRequest)
    ])
        .then(function (response) {
            const personalProfileQuestions = {
                    income: response[0],
                    credits: response[1],
                    deductions: response[2],
                    specialScenarios: response[3],
                    maritalStatus: response[4],
                    dependants: response[5]
                },
                dataObject = session.getUserProfileSession(req);
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


personalProfilePages.actionSavePersonalProfile = function(req, res, next) {
    session.hasUserProfileSession(req)
        .then(function(hasSession){
            //check if session is initiated
            if (!hasSession){
                return session.actionStartUserProfileSession(req);
            }
        })
        .then(function(){
            //save account and qoute to session
            switch(req.body.action){
                case 'api-pp-last-name':
                    return userProfile.saveLastName(req);
                    break;
                case 'api-pp-special-scenarios':
                case 'api-pp-marital-status':
                case 'api-pp-dependants':
                case 'api-pp-income':
                case 'api-pp-credits':
                case 'api-pp-deductions':
                    return userProfile.saveActiveTiles(req);
                    break;

                default:
                    return promise.reject('tax profile - invalid action');
                    break;
            }
        })
        .then(function(){
            //success
            res.status(util.http.status.accepted).json({
                action: req.body.action,
                status: 'success',
                data: session.getUserProfileSession(req)
            });
        })
        .catch(function(error){
            if(!error){
                error = 'Could not save account';
            }
            next(new errors.BadRequestError(error,true));
        });
};


module.exports = personalProfilePages;
