const util = {};

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
    income: 1,
    credits: 2,
    deductions: 3,
    credits2: 4,
    specialSituations: 5,
    other: 6
};

util.globals = {
    metaTitlePrefix: 'Taxplan | ',
    apiUrl: process.env.API_URL,
    apiProductId: process.env.API_PRODUCT_ID
};

module.exports = util;