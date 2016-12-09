const //packages
    moment = require('moment');

var sessionModel = {};

sessionModel.getTaxProfileUserObject = function(data){
    return {
        id: data.accountId,
        firstName: data.name,
        activeTiles: {}
    }
};

sessionModel.getTaxProfileObject = function(data){
    return {
        hasTaxProfileSession: true,
        expiry: moment().add(7, 'days'),//todo, refresh expiry upon update
        currentPage: 'welcome',
        users: [
            sessionModel.getTaxProfileUserObject(data)
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

module.exports = sessionModel;