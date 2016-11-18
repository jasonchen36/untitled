const //services
    express = require('express'),
    router = express.Router(),
//middleware
    authenticationMiddleware = require('../middleware/authentication'),
//controllers
    taxProfileController = require('../controllers/tax_profile');

router.route('/').get(function(req, res, next) {
    res.redirect('/tax-profile/1');
});

router.route('/1')
    .get(taxProfileController.getPageOne)
    .put(taxProfileController.actionPageOne);

router.route('/2')
    .get(authenticationMiddleware.redirectWithoutAccountSession, taxProfileController.getPageTwo);

router.route('/3')
    .get(authenticationMiddleware.redirectWithoutAccountSession, taxProfileController.getPageThree);

router.route('/4')
    .get(authenticationMiddleware.redirectWithoutAccountSession, taxProfileController.getPageFour);

router.route('/5')
    .get(authenticationMiddleware.redirectWithoutAccountSession, taxProfileController.getPageFive);

router.route('/6')
    .get(authenticationMiddleware.redirectWithoutAccountSession, taxProfileController.getPageSix);

router.route('/7')
    .get(authenticationMiddleware.redirectWithoutAccountSession, taxProfileController.getPageSeven);

router.route('/quote')
    .get(authenticationMiddleware.redirectWithoutAccountSession, taxProfileController.getPageQuote);

router.route('/logout')
    .get(taxProfileController.getLogoutPage);

module.exports = router;