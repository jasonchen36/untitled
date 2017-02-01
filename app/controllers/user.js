const //packages
    requestPromise = require('request-promise'),
//services
    util = require('../services/util'),
    session = require('../services/session'),
    cookies = app.cookies,
    errors = require('../services/errors');

var userPages = {};



function getPageAfterLogin(req)  {
   var profileSession = session.getUserProfileSession(req);
   var completedFlow = true;
   profileSession.taxReturns.forEach(function(entry) {
           if (entry.status.id === 2) {
               completedFlow = false;
           }
       });
       console.log(completedFlow);
       if (completedFlow === true){
          return '/dashboard';
       } else {
           if (req.session.userProfile.users[0].migrated_user === "Yes"){
               console.log('it goes in here');
               return '/tax-profile';
           }
           return '/personal-profile';
       }

}



/************ login ************/
userPages.getLoginPage = function(req, res, next){
    res.render('user/login', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix+'Sign In'
        },
        account: session.getTaxProfileSession(req),
        user: session.getUserProfileSession(req),
        locals:
        {
           apiUrl: process.env.API_URL,
           webUrl: process.env.WEB_URL
        }
    });
};

userPages.getPrivacyPage = function(req, res, next){
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

userPages.getTermsPage = function(req, res, next){
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

userPages.actionLoginUser = function(req, res, next){
    req.checkBody('action').notEmpty();
    req.checkBody('password').notEmpty();
    req.checkBody('email').notEmpty();

    if (req.validationErrors() || req.body.action !== 'api-login'){
        next(new errors.BadRequestError('login - validation errors',true));
    } else {
        const options = {
            method: 'POST',
            uri: process.env.API_URL+'/login',
            body: {
                password: req.body.password,
                email: req.body.email
            },
            json: true
        };
        requestPromise(options)
            .then(function (response) {
                try{
                    const responseToken = response.token;
                    session.actionStartUserProfileSession(req,responseToken)
                        .then(function(){
                            var page = getPageAfterLogin(req);

                            res.status(util.http.status.accepted).json({
                                action: 'login',
                                status: 'success',
                                forward: page
                            });
                        });
                } catch(error){
                    if (!error){
                        error = 'Could not start user session';
                    }
                    next(new errors.InternalServerError(error,true));
                }
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

/************ register ************/
userPages.getRegisterPage = function(req, res, next){
    res.render('user/register', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + 'Register'
        },
        account: session.getTaxProfileSession(req),
        user: session.getUserProfileSession(req),
        locals:
        {
           apiUrl: process.env.API_URL
        }
    });
};

userPages.actionRegisterUser = function(req, res, next){
    req.checkBody('action').notEmpty();
    req.checkBody('password').notEmpty();
    req.checkBody('email').notEmpty();

    if (req.validationErrors() || req.body.action !== 'api-register'){
        next(new errors.BadRequestError('register - validation errors',true));
    } else {
        const taxProfileSession = session.getTaxProfileSession(req),
            options = {
            method: 'POST',
            uri: process.env.API_URL+'/users',
            body: {
                password: req.body.password,
                first_name: taxProfileSession.users[0].firstName,
                last_name: ' ',//not entered until person profile section
                email: req.body.email,
                accountId: taxProfileSession.users[0].id
            },
            json: true
        };
        requestPromise(options)
            .then(function (response) {
                try{
                    const responseToken = response.token;
                    session.actionStartUserProfileSession(req,responseToken)
                        .then(function(){
                            res.status(util.http.status.accepted).json({
                                action: 'register',
                                status: 'success'
                            });
                        });
                } catch(error){
                    if (!error){
                        error = 'Could not start user session';
                    }
                    next(new errors.InternalServerError(error,true));
                }
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

/************ password reset ************/
userPages.getPasswordResetPage = function(req, res, next){
    res.render('user/password-reset', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + 'Password Reset'
        },
        account: session.getTaxProfileSession(req),
        user: session.getUserProfileSession(req),
        locals:
        {
           apiUrl: process.env.API_URL
        }
    });
};


userPages.getAuthorizedPasswordResetPage = function(req, res, next){


    res.render('user/password-reset-authorized', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + 'Password Reset'
        },
        account: session.getTaxProfileSession(req),
        user: session.getUserProfileSession(req),
        locals: {
            token: req.params.token,
            apiUrl: process.env.API_URL
        }
    });
};


/************ logout ************/
userPages.getLogoutPage = function(req, res, next) {
    session.actionDestroyAllSession(req)
        .then(function(){
            res.redirect('/login');
        });
};

userPages.actionLogoutUser = function(req, res, next) {
    session.actionDestroyAllSession(req)
        .then(function(){
            cookies.clearAllCookies().then(function() {
                res.status(util.http.status.ok).json({
                    action: 'logout',
                    status: 'success'
                });
            });
        });
};






module.exports = userPages;
