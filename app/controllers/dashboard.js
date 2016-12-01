const //packages
    requestPromise = require('request-promise'),
    fs = require('fs'),
//services
    util = require('../services/util'),
    session = require('../services/session'),
    errors = require('../services/errors');

var dashboardPages = {};

/************ dashboard ************/
dashboardPages.getDashboardPage = function(req, res, next){
    const userObject = session.getUserObject(req),
        options = {
            method: 'GET',
            uri: process.env.API_URL+'/messages',
            headers: {
                'Authorization': 'Bearer '+session.getUserValue(req,'token')
            },
            body: {},
            json: true
        };
    requestPromise(options)
        .then(function (response) {
            userObject.messages = response.messages;
            try {
                res.render('dashboard/dashboard', {
                    meta: {
                        pageTitle: util.globals.metaTitlePrefix + 'Dashboard'
                    },
                    account: session.getAccountObject(req),
                    user: userObject,
                    locals: {
                        userToString: JSON.stringify(userObject),
                        messagesToString: JSON.stringify(response)
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
                'Authorization': 'Bearer '+session.getUserValue(req,'token')
            },
            body: {
                //todo, remove subject after api is updated
                from: session.getUserValue(req,'id'),
                subject: 'subject is required',
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

// dashboardPages.actionAddNewDocument = function(req, res, next) {
//     if (req.validationErrors() || req.body.action !== 'api-dashboard-chat'){
//         next(new errors.BadRequestError('dashboard upload - new document - validation errors',true));
//     } else {
//         res.setHeader("content-disposition", "attachment; filename=logo.png");
//         request('http://google.com/images/srpr/logo11w.png').pipe(res);
//         var readableStream = fs.createReadStream('file1.txt'),
//             writableStream = fs.createWriteStream('file2.txt');
//
//         readableStream.pipe(writableStream);
//     }
// };

module.exports = dashboardPages;