const //packages
    moment = require('moment');

var sessionModel = {};

sessionModel.getTaxProfileObject = function(data){
    return {
        hasTaxProfileSession: true,
        expiry: moment().add(7, 'days'),//todo, refresh expiry upon update
        currentPage: 'welcome',
        id: data.accountId,
        firstName: data.name,
        activeTiles: {}
    };
};

sessionModel.getUserObject = function(data){
    return {
        hasUserSession: true,
        token: data.token,
        expiry: moment().add(1, 'hour'),//todo, refresh expiry upon update
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
        currentPage: '',//todo, determine current page for personal profile
        activeTiles: {}
    };
};

module.exports = sessionModel;