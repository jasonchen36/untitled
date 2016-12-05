const //packages
    _ = require('lodash'),
    promise = require('bluebird'),
    requestPromise = require('request-promise'),
//services
    util = require('../services/util'),
    session = require('../services/session'),
    errors = require('../services/errors'),
    personalProfile = require('../services/personal_profile'),
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
                    maritalStatus: questionsModel.getMaritalStatusData()
                },
                dataObject = personalProfile.getDataObject(req);
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
    session.hasPersonalProfileSession(req)
        .then(function(hasSession){
            //check if session is initiated
            if (!hasSession){
                return session.actionStartPersonalProfileSession(req);
            }
        })
        .then(function(){
            //save account and qoute to session
            switch(req.body.action){
                case 'api-pp-last-name':
                    return personalProfile.saveLastName(req);
                    break;
                case 'api-pp-special-scenarios':
                    return personalProfile.saveActiveTiles(req, 'specialScenarios');
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
                data: personalProfile.getDataObject(req)
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