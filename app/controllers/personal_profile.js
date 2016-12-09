const //packages
    _ = require('lodash'),
    promise = require('bluebird'),
    requestPromise = require('request-promise'),
//services
    util = require('../services/util'),
    session = require('../services/session'),
    errors = require('../services/errors'),
    user = require('../services/user'),
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
        creditsRequest = _.clone(requestObject, true);
    specialScenariosRequest.uri = creditsRequest.uri+util.questionCategories.credits2;
    creditsRequest.uri = creditsRequest.uri+util.questionCategories.credits2;
    promise.all([
        requestPromise(specialScenariosRequest),
        requestPromise(creditsRequest)
    ])
        .then(function (response) {
            const personalProfileQuestions = {
                    specialScenarios: response[0],
                    credits: response[1],
                    maritalStatus: questionsModel.getMaritalStatusData(),
                    dependants: questionsModel.getDependentsData()

                },
                dataObject = session.getUserProfileObject(req);
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
        .catch(function (error) {
            if (!error){
                error = 'Could not retrieve questions'
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
                    return user.saveLastName(req);
                    break;
                case 'api-pp-special-scenarios':
                    return user.saveActiveTiles(req, 'specialScenarios');
                    break;
                case 'api-pp-marital-status':
                    return user.saveActiveTiles(req, 'maritalStatus');
                    break;
                case 'api-pp-dependants':
                    return user.saveActiveTiles(req, 'dependants');
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
                data: session.getUserProfileObject(req)
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
