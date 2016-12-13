const //packages
    moment = require('moment'),
    _ = require('lodash');

var sessionModel = {};

sessionModel.getTaxProfileUserObject = function(data){
    var userObject = {
        id: '',
        firstName: '',
        activeTiles: {}
    };
    if (typeof data !== 'undefined' && data.hasOwnProperty('accountId') && data.accountId){
        userObject.id = String(data.accountId);
        userObject.firstName = data.firstName;
    }
    return userObject;
};

sessionModel.getTaxProfileObject = function(data){
    return {
        hasTaxProfileSession: true,
        expiry: moment().add(7, 'days'),
        currentPage: 'welcome',
        users: [
            sessionModel.getTaxProfileUserObject(data),
            {},//spouse
            {}//other
        ]
    };
};

sessionModel.getUserProfileUserObject = function(data){
    return {
        id: data.id,
        role: data.role,
        provider: data.provider,
        firstName: data.name && data.name.length > 0?data.name:data.first_name,
        email: data.email,
        phone: data.phone,
        username: data.username,
        lastName: data.last_name,
        accounts: data.accounts,
        birthday: data.birthday,
        resetKey: data.reset_key,
        accountId: data.account_id,
        activeTiles: {}
    }
};

sessionModel.getUserProfileObject = function(data){
    return {
        hasUserProfileSession: true,
        token: data.token,
        expiry: moment().add(1, 'hour'),//todo, refresh expiry upon update
        currentPage: '',//todo, determine current page for personal profile
        users: [
            sessionModel.getUserProfileUserObject(data)
        ]
    };
};


sessionModel.getUserTaxReturns = function(data){

    var taxReturnsArr = [];

        _.forEach(data.taxReturns, function(item){

            var taxReturn = {};

            taxReturn.taxReturnid = item.id;
            taxReturn.productId = item.product_id;
            taxReturn.accountId = item.account_id;
            taxReturn.statusId = item.status_id;
            taxReturn.firstName = item.first_name;
            taxReturn.lastName = item.last_name;
            taxReturn.provinceOfResidence = item.province_of_redidence; // todo, update after fixed in DB
            taxReturn.dateOfBirth = item.date_of_birth;
            taxReturn.canadianCitizen = item.canadian_citizen;
            taxReturn.authorizeCRA = item.authorize_cra;

            taxReturnsArr.push(taxReturn);
        });



    return taxReturnsArr;
};

module.exports = sessionModel;