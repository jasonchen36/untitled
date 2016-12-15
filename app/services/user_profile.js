const //packages
    requestPromise = require('request-promise'),
    promise = require('bluebird'),
    _ = require('lodash'),
    moment = require('moment'),
//services
    util = require('./util'),
    session = require('./session');

var personalProfile = {};

function getCurrentPage(action){
    return action.split('api-pp-')[1];
}

personalProfile.saveLastName = function(req){
    return promise.resolve()
        .then(function(){
            //validate
            req.checkBody('data').notEmpty();

            //can only create an user profile on the name step
            if (req.validationErrors() || req.body.action !== 'api-pp-last-name'){
                return promise.reject('api - user session creation - validation errors');
            } else {
                const userProfileSession = session.getUserProfileSession(req);

                var index = 0;
                var lastNameKeys = Object.keys(req.body.data);
                userProfileSession.taxReturns.forEach(function (entry){
                    // add formData into taxReturn data
                    var obj = lastNameKeys[index];
                    index++;
                    entry.lastName = req.body.data[obj].lastName;

                    // PUT request to update lastname
                    const options = {
                        method: 'PUT',
                        uri: process.env.API_URL+'/tax_return/'+entry.taxReturnId,
                        headers: {}
                        ,
                        body: {
                            accountId: entry.accountId,
                            productId: process.env.API_PRODUCT_ID,
                            lastName: entry.lastName
                        },
                        json: true
                    };
                    return requestPromise(options)
                        .then(function (response) {
                            try {
                                if(response.statusCode === 200){
                                    return promise.resolve();
                                }
                            } catch(error) {
                                if(!error){
                                    error = 'Could not update lastname';
                                }
                                return promise.reject(error);
                            }
                        });
                });

                userProfileSession.currentPage = getCurrentPage(req.body.action);
                userProfileSession.expiry = moment().add(1, 'hour');//refresh after update
                session.setUserProfileSession(req, userProfileSession);
                return promise.resolve();
            }
        });
};

personalProfile.saveActiveTiles = function(req, group){
    return promise.resolve()
        .then(function() {
            //validate
            req.checkBody('data').notEmpty();

            if (req.validationErrors()){
                return promise.reject('api - user profile update - validation errors');
            } else {
                const userProfileSession = session.getUserProfileSession(req);
                var group = getCurrentPage(req.body.action);
                //group nicename
                switch (group) {
                    case 'special-scenarios':
                        group = 'specialScenarios';
                        break;
                    case 'marital-status':
                        group = 'maritalStatus';
                        break;
                }
                //save active tiles
                userProfileSession.users.forEach(function (entry) {
                    if (entry.hasOwnProperty('activeTiles')) {
                        if (!entry.activeTiles.hasOwnProperty(group) && req.body.data.hasOwnProperty(entry.id)) {
                            entry.activeTiles[group] = {};
                        }
                        entry.activeTiles[group] = req.body.data[entry.id];
                    }
                });
                userProfileSession.currentPage = getCurrentPage(req.body.action);
                userProfileSession.expiry = moment().add(7, 'days');//refresh after update
                session.setUserProfileSession(req, userProfileSession);
                return promise.resolve();
            }
        });
};

module.exports = personalProfile;