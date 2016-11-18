const express = require('express'),
    router = express.Router(),
    taxReturnController = require('../controllers/tax_profile');

router.route('/').get(function(req, res, next) {
    res.redirect('/tax-profile/page1');
});

router.route('/page1')
    .get(taxReturnController.getPage1);

router.route('/page2')
    .get(taxReturnController.getPage2);

router.route('/page3')
    .get(taxReturnController.getPage3);

module.exports = router;