const //packages
    moment = require('moment'),
    _ = require('lodash'),
//services
    logger = require('../services/logger');

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
        apiUrl: data.apiUrl,
        productId: data.productId,
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
        migrated_user: data.migrated_user,
        taxReturns: [],
        activeTiles: {}
    };
};

sessionModel.getUserProfileObject = function(data){
    return {
        hasUserProfileSession: true,
        token: data.token,
        apiUrl: process.env.API_URL,
        productId: process.env.API_PRODUCT_ID,
        taxProId: data.taxpro_id,
        taxProPic: data.taxpro_pic,
        taxProDescription: data.taxpro_desc,
        taxProName: data.taxpro_name,
        taxProTitle: data.taxpro_title,
        expiry: moment().add(1, 'hour'),
        users: [
            sessionModel.getUserProfileUserObject(data)
        ]
    };
};


sessionModel.getDocumentChecklistFilerName = function(data){

    var name = data.first_name;
    if(data.last_name !== null)  {
        name =  name + " " + data.last_name;
    }

    return {
        name: name
    };
};


sessionModel.getDocumentChecklistItemObject = function(data){
    return {
        checklistItemId: data.checklist_item_id,
        name: data.name,
        documents: data.documents,
        filers: _.map(data.filers, sessionModel.getDocumentChecklistFilerName)
    };
};

sessionModel.getAdditionalDocumentObject = function(data){
    try {
        //todo, urls deleting session
        console.log(data.thumbnailUrl, data.url);
        return {
            documentId: data.documentId,
            quoteId: data.quoteId,
            taxReturnId: data.taxReturnId,
            firstName: data.firstName,
            lastName: data.lastName,
            checklistItemId: data.checkListItemId,
            name: data.name,
            // url: data.url,
            // thumbnailUrl: data.thumbnailUrl
        };
    } catch (error) {
        logger.error(error);
    }
};

sessionModel.getDocumentChecklistObject = function(data){
    return {
        checklistItems: _.map(data.checklistitems, sessionModel.getDocumentChecklistItemObject),
        additionalDocuments: data.additionalDocuments
    };
};

sessionModel.getChatMessageObject = function(data){
    return {
        status: data.status,
        body: data.body,
        subject: data.subject,
        clientId: data.client_id,
        fromName: data.fromname,
        fromId: data.from_id,
        rawDate: moment(data.date),
        date: moment(data.date).format('MMM D [-] h:mm A').toString(),
        isFromUser: data.client_id === data.from_id,
        isFromTaxPro: data.from_role === 'Tax Pro', //todo is this the final role name?
        isFromTaxPlan: data.from_role === 'TAXPlan', // todo is this the final role name?
        isFirst: false,
        replacedBody: "default"
    };
};

sessionModel.getUserTaxReturns = function(data){
    return {
        taxReturnId: data.id,
        productId: data.product_id,
        accountId: data.account_id,
        status: {
            id: data.status.id,
            name: data.status.name,
            displayText: data.status.display_text
        },
        firstName: data.first_name,
        lastName: data.last_name,
        province: data.province_of_residence,
        dateOfBirth: data.date_of_birth,
        canadianCitizen: data.canadian_citizen,
        authorizeCRA: data.authorize_cra
    };
};

module.exports = sessionModel;
