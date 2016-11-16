const //services
    util = require('../services/util'),
    session = require('../services/session');

var questionnairePrefix = 'Question ',
    questionnairePages = {};

questionnairePages.getPage1 = function(req, res, next){
    res.render('questionnaire/page1', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + questionnairePrefix + '1'
        },
        user: session.getUserObject(req),
        data: {}
    });
};

questionnairePages.getPage2 = function(req, res, next){
    res.render('questionnaire/page2', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + questionnairePrefix + '2'
        },
        user: session.getUserObject(req),
        data: {}
    });
};

questionnairePages.getPage3 = function(req, res, next){
    res.render('questionnaire/page3', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + questionnairePrefix + '3'
        },
        user: session.getUserObject(req),
        data: {}
    });
};

module.exports = questionnairePages;