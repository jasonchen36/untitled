const //packages
    _ = require('lodash'),
    promise = require('bluebird'),
    requestPromise = require('request-promise'),
//services
    util = require('../services/util'),
    session = require('../services/session'),
    errors = require('../services/errors'),
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
            var personalProfile = session.getPersonalProfileObject(req);
            personalProfile.questions = {
                specialScenarios: response[0],
                credits: response[1],
                maritalStatus: questionsModel.getMaritalStatusData()
            };
            const dataObject = util.mergeObjects([
                session.getUserObject(req),//user
                session.getAccountObject(req),//account,
                personalProfile//personal profile
            ]);
            try {
                res.render('personal_profile/personal_profile', {
                    meta: {
                        pageTitle: util.globals.metaTitlePrefix + 'Personal Profile'
                    },
                    locals: {
                        personalProfileToString: JSON.stringify(dataObject)
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

module.exports = personalProfilePages;