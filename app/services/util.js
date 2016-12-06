const //packages
    _ = require('lodash');

var util = {};

util.http = {
    status: {
        ok: 200,
        created: 201,
        accepted: 202,
        noContent: 204,
        movedPermanently: 301,
        temporaryRedirect: 307,
        badRequest: 400,
        unauthorized: 401,
        forbidden: 403,
        notFound: 404,
        internalServerError: 500,
        serviceUnavailable: 503
    }
};

util.environment = {
    isProduction: function () {
        return process.env.NODE_ENV.toLowerCase() === 'production';
    }
};

util.questionCategories = {
    filingFor: 0,
    income: 1,
    credits: 2,
    deductions: 3,
    credits2: 4,
    specialScenarios: 5,
    other: 6,
    maritalStatus: 7,
    dependants: 8

};

util.globals = {
    metaTitlePrefix: 'Taxplan | ',
    apiUrl: process.env.API_URL,
    apiProductId: process.env.API_PRODUCT_ID
};

util.mergeObjects = function(objectArray){
    var finalObject = {};
    _.each(objectArray, function(entry){
        _.forOwn(entry, function(value, key) {
            finalObject[key] = value;
        });
    });
    return finalObject;
};

module.exports = util;