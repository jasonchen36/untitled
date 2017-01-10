const //packages
    requestPromise = require('request-promise'),
    fs = require('fs'),
    moment = require('moment'),
    promise = require('bluebird'),
    _ = require('lodash'),
//services
    util = require('../services/util'),
    session = require('../services/session'),
    errors = require('../services/errors'),
    uploads = require('../services/uploads'),
//models
    sessionModel = require('../models/session');

var dashboardPages = {};
var dashboardForm;

/************ dashboard ************/
dashboardPages.getDashboardPage = function(req, res, next){


    var userProfile = session.getUserProfileSession(req);
    var accountId = userProfile.users[0].accountId ;

    const accountRequest = {
        method: 'GET',
        uri: process.env.API_URL+'/account/' + accountId,
        headers: {
            'Authorization': 'Bearer '+session.getUserProfileValue(req,'token')
        },
        body: {},
        json: true
    };

    requestPromise(accountRequest).then(function(accountData) {


        var quoteId = accountData.quotes[0].id;

        const dataObject = session.getUserProfileSession(req);
        try {
                      
                dataObject.documentChecklist = "";
                dataObject.newMessageCount = 0;
                dataObject.messages = [];
                dataObject.quoteId = quoteId;
                dataObject.taxReturnId = accountData.taxReturns[0].id;
                dataObject.uploadUrl = userProfile.apiUrl + '/quote/' + quoteId + '/document';

                res.render('dashboard/dashboard', {
                    meta: {
                        pageTitle: util.globals.metaTitlePrefix + 'Dashboard'
                    },
                    data: dataObject,
                    locals: {
                        userToString: JSON.stringify(dataObject)
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



module.exports = dashboardPages;
