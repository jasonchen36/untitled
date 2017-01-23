const //services
    express = require('express'),
    router = express.Router(),
//middleware
    authenticationMiddleware = require('../middleware/authentication'),
//controllers
    userController = require('../controllers/user');

router.route('/').get(function(req, res, next) {
    res.redirect('/login');
});

router.route('/login')
    .get(authenticationMiddleware.redirectWithUserSession,userController.getLoginPage)
    .put(userController.actionLoginUser);

router.route('/register')
    .get(authenticationMiddleware.redirectWithUserSession,authenticationMiddleware.redirectWithoutTaxProfileSession,userController.getRegisterPage)
    .post(userController.actionRegisterUser);

router.route('/forgot-password')
    .get(authenticationMiddleware.redirectWithUserSession,userController.getPasswordResetPage);

router.route('/password-reset/:token')
    .get(userController.getAuthorizedPasswordResetPage);

router.route('/logout')
    .get(userController.getLogoutPage)
    .put(userController.actionLogoutUser);

router.route('/privacy-policy')
    .get(authenticationMiddleware.redirectWithUserSession,userController.getPrivacyPage);

router.route('/terms-conditions')
    .get(authenticationMiddleware.redirectWithUserSession,userController.getTermsPage);

module.exports = router;