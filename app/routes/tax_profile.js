const express = require('express'),
    router = express.Router(),
    taxReturnController = require('../controllers/tax_profile');

router.route('/').get(function(req, res, next) {
    res.redirect('/tax-profile/1');
});

router.route('/1')
    .get(taxReturnController.getPageOne);

router.route('/2')
    .get(taxReturnController.getPageTwo);

router.route('/3')
    .get(taxReturnController.getPageThree);

router.route('/4')
    .get(taxReturnController.getPageFour);

router.route('/5')
    .get(taxReturnController.getPageFive);

router.route('/6')
    .get(taxReturnController.getPageSix);

router.route('/7')
    .get(taxReturnController.getPageSeven);

router.route('/quote')
    .get(taxReturnController.getPageQuote);

module.exports = router;