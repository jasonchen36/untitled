const express = require('express'),
    router = express.Router(),
    questionnaireController = require('../controllers/questionnaire');

router.route('/page1')
    .get(questionnaireController.getPage1);

module.exports = router;