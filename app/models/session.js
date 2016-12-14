const //packages
    moment = require('moment'),
    _ = require('lodash');

var sessionModel = {};

sessionModel.getTaxProfileUserObject = function(data){
    var userObject = {
        id: '',//for tax profile accountId === id
        firstName: '',
        taxReturnId: '',
        activeTiles: {}
    };
    if (typeof data !== 'undefined' && data.hasOwnProperty('accountId') && data.accountId){
        userObject.id = data.accountId;
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
        expiry: moment().add(1, 'hour'),
        currentPage: '',//todo, determine current page for personal profile
        users: [
            sessionModel.getUserProfileUserObject(data)
        ]
    };
};

sessionModel.getDocumentChecklistItemObject = function(data){
    return {
        checklistItemId: data.checklist_item_id,
        name: data.name,
        documents: data.documents
    }
};

sessionModel.getDocumentChecklistObject = function(data){
    return {
        checklistItems: _.map(data.checklistitems, sessionModel.getDocumentChecklistItemObject),
        additionalDocuments: data.additionalDocuments
    };
};

module.exports = sessionModel;