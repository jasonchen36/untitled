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
    .get(authenticationMiddleware.redirectWithUserSession,authenticationMiddleware.redirectWithoutAccountSession,userController.getRegisterPage)
    .post(userController.actionRegisterUser);

router.route('/password-reset')
    .get(authenticationMiddleware.redirectWithUserSession,userController.getPasswordResetPage)
    .post(userController.actionPasswordReset)
    .put(userController.actionAuthorizedPasswordReset);

router.route('/password-reset/:token')
    .get(userController.getAuthorizedPasswordResetPage);

router.route('/logout')
    .get(userController.getLogoutPage)
    .put(userController.actionLogoutUser);

module.exports = router;