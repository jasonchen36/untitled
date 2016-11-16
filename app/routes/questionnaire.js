const express = require('express'),
    router = express.Router(),
    questionnaireController = require('../controllers/questionnaire');

router.route('/page1')
    .get(questionnaireController.getPage1);

router.route('/page2')
    .get(questionnaireController.getPage2);

router.route('/page3')
    .get(questionnaireController.getPage3);

module.exports = router;