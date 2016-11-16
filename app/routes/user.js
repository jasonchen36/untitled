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
    .get(authenticationMiddleware.redirectWithSession,userController.getLoginPage)
    .put(userController.actionLoginUser);

router.route('/register')
    .get(authenticationMiddleware.redirectWithSession,userController.getRegisterPage)
    .post(userController.actionRegisterUser);

router.route('/forgot-password')
    .get(authenticationMiddleware.redirectWithSession,userController.getForgotPasswordPage)
    .put(userController.actionForgotPassword);

router.route('/logout')
    .get(userController.getLogoutPage)
    .put(userController.actionLogoutUser);

module.exports = router;