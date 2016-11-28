const //packages
    promise = require('bluebird'),
//services
    taxProfile = {};

taxProfile.saveName = function(req){
    return promise.resolve()
        .then(function(){
            //validate
            req.checkBody('name').notEmpty();

            //can only create an account on the name step
            if (req.validationErrors() || req.body.action !== 'api-tp-name'){
                return promise.reject('api - account session creation - validation errors');
            } else {
                req.session.account.name = req.body.name;
                return promise.resolve();
            }
        });
};

taxProfile.saveFilingType = function(req){
    return promise.resolve()
        .then(function() {
            //validate
            req.checkBody('myself').notEmpty();
            req.checkBody('spouse').notEmpty();
            req.checkBody('other').notEmpty();

            //can only create an account on the name step
            if (req.validationErrors() || req.body.action !== 'api-tp-filingType'){
                return promise.reject('api - account session creation - validation errors');
            } else {
                const filingForMyself = req.body.myself,
                    filingForSpouse = req.body.spouse,
                    filingForOther = req.body.other;
                req.session.account.filingType = {
                    myself: filingForMyself,
                    spouse: filingForSpouse,
                    other: filingForOther
                };
                return promise.resolve();
            }
        });
};

module.exports = taxProfile;