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

/************ dashboard ************/
dashboardPages.getDashboardPage = function(req, res, next){
    const messageRequest = {
            method: 'GET',
            uri: process.env.API_URL+'/messages',
            headers: {
                'Authorization': 'Bearer '+session.getUserProfileValue(req,'token')
            },
            body: {},
            json: true
        },
        documentChecklistRequest = {
            method: 'GET',
            uri: process.env.API_URL+'/quote/4/checklist',//todo, dynamic quote id
            headers: {
                'Authorization': 'Bearer '+session.getUserProfileValue(req,'token')
            },
            body: {},
            json: true
        };
    promise.all([
        requestPromise(messageRequest),
        requestPromise(documentChecklistRequest)
    ])
        .then(function (response) {
            const dataObject = session.getUserProfileSession(req);
            try {
                dataObject.documentChecklist = sessionModel.getDocumentChecklistObject(response[1]);
                dataObject.newMessageCount = 0;
                dataObject.messages = _.map(response[0].messages, sessionModel.getChatMessageObject);//todo, fix bug where session data is lost due to this line
                dataObject.messages.forEach(function(entry){
                    //count unread messages
                    if(entry.status.toLowerCase() === 'new'){
                        dataObject.newMessageCount++;
                    }
                });
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


/************ chat ************/
dashboardPages.actionAddNewMessage = function(req, res, next){
    req.checkBody('message').notEmpty();

    if (req.validationErrors() || req.body.action !== 'api-dashboard-chat'){
        next(new errors.BadRequestError('dashboard chat - new message - validation errors',true));
    } else {
        const options = {
            method: 'POST',
            uri: process.env.API_URL+'/messages/',
            headers: {
                'Authorization': 'Bearer '+session.getUserProfileValue(req,'token')
            },
            body: {
                from: session.getUserProfileValue(req,'id'),
                body: req.body.message
            },
            json: true
        };
        requestPromise(options)
            .then(function (response) {
                res.status(util.http.status.accepted).json({
                    action: 'dashboard chat message added',
                    status: 'success'
                });
            })
            .catch(function (response) {
                var error = response;
                if (response && response.hasOwnProperty('error')){
                    error = response.error;
                }
                next(new errors.BadRequestError(error,true));
            });
    }
};

dashboardPages.actionAddNewDocument = function(req, res, next) {
    req.checkBody('fileName').notEmpty();
    req.checkBody('checklistItemId').notEmpty();

    if (req.validationErrors() || req.body.action !== 'api-dashboard-upload'){
        next(new errors.BadRequestError('dashboard upload - new document - validation errors',true));
    } else {
        const fileName = req.body.fileName,
            checklistItemId = parseInt(req.body.checklistItemId);
        var options = {
            method: 'POST',
            uri: process.env.API_URL+'/quote/4/document',//todo dynamic quote id
            headers: {
                'Authorization': 'Bearer '+session.getUserProfileValue(req,'token')
            },
            formData: {
                taxReturnId: 1,//todo, dynamic tax return
                uploadFileName: fs.createReadStream(util.globals.uploadsFolderDirectory+fileName)
            },
            json: true
        };
        if (checklistItemId !== 0){
            //additional document id = 0
            options.formData.checklistItemId = checklistItemId;
        }
        requestPromise(options)
            .then(function (response) {
                uploads.deleteFile(fileName)
                    .then(function(){
                        res.status(util.http.status.accepted).json({
                            action: 'dashboard upload document added',
                            status: 'success'
                        });
                    });
            })
            .catch(function (response) {
                var error = response;
                if (response && response.hasOwnProperty('error')){
                    error = response.error;
                }
                next(new errors.BadRequestError(error,true));
            });
    }
};

module.exports = dashboardPages;