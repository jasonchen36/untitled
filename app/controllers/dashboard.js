const //packages
    requestPromise = require('request-promise'),
    fs = require('fs'),
    moment = require('moment'),
//services
    util = require('../services/util'),
    session = require('../services/session'),
    errors = require('../services/errors'),
    uploads = require('../services/uploads');

var dashboardPages = {};

/************ dashboard ************/
dashboardPages.getDashboardPage = function(req, res, next){
    const options = {
        method: 'GET',
        uri: process.env.API_URL+'/messages',
        headers: {
            'Authorization': 'Bearer '+session.getUserProfileValue(req,'token')
        },
        body: {},
        json: true
    };
    requestPromise(options)
        .then(function (response) {
            const dataObject = session.getUserProfileSession(req);
            dataObject.newMessageCount = 0;
            dataObject.messages = response.messages;
            response.messages.forEach(function(entry){
                //count unread messages
                if(entry.status && entry.status.toLowerCase() === 'new'){
                    dataObject.newMessageCount++;
                }
                //determine if message if from user or tax pro
                if(entry.client_id === entry.from_id){
                    entry.isFromUser = true;
                }
                //format timestamp nicely
                entry.date = moment(entry.date).format('MMM D [-] h:mm A').toString();
            });
            try {
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
        .catch(function (error) {
            if (!error){
                error = 'Could not retrieve messages'
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
                next(new errors.BadRequestError(response.error,true));
            });
    }
};

dashboardPages.actionAddNewDocument = function(req, res, next) {
    req.checkBody('fileName').notEmpty();

    if (req.validationErrors() || req.body.action !== 'api-dashboard-upload'){
        next(new errors.BadRequestError('dashboard upload - new document - validation errors',true));
    } else {
        const fileName = req.body.fileName,
            options = {
                method: 'POST',
                uri: process.env.API_URL+'/quote/1/document',//todo dynamic quote id
                headers: {
                    'Authorization': 'Bearer '+session.getUserProfileValue(req,'token')
                },
                formData: {
                    taxReturnId: 1,//todo, dynamic tax return and checklist item values
                    checklistItemId: 1,
                    uploadFileName: fs.createReadStream(util.globals.uploadsFolderDirectory+fileName)
                },
                json: true
            };
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
                next(new errors.BadRequestError(response.error,true));
            });
    }
};

module.exports = dashboardPages;