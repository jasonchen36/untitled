const //services
    util = require('../services/util');

var questionnairePrefix = 'Question ',
    questionnairePages = {};

questionnairePages.getPage1 = function(req, res, next){
    console.log('got to controller');
    res.render('questionnaire/page1', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + questionnairePrefix + '1'
        },
        data: {}
    });
};

module.exports = questionnairePages;