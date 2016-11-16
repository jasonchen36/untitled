const express = require('express'),
    router = express.Router(),
    taxReturnController = require('../controllers/tax_return');

router.route('/page1')
    .get(taxReturnController.getPage1);

router.route('/page2')
    .get(taxReturnController.getPage2);

router.route('/page3')
    .get(taxReturnController.getPage3);

module.exports = router;