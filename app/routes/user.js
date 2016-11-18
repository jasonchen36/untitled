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
    .get(authenticationMiddleware.redirectWithUserSession,userController.getRegisterPage)
    .post(userController.actionRegisterUser);

router.route('/password-reset')
    .get(authenticationMiddleware.redirectWithUserSession,userController.getForgotPasswordPage)
    .put(userController.actionForgotPassword);

router.route('/logout')
    .get(userController.getLogoutPage)
    .put(userController.actionLogoutUser);

router.route('/dashboard')
    .get(userController.getDashboardPage);

module.exports = router;