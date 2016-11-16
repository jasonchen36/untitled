const express = require('express'),
    router = express.Router(),
    userController = require('../controllers/user');

router.route('/').get(function(req, res, next) {
    res.redirect('/login');
});

router.route('/login')
    .get(userController.getLoginPage)
    .put(userController.actionLoginUser);

router.route('/register')
    .get(userController.getRegisterPage)
    .post(userController.actionRegisterUser);

router.route('/forgot-password')
    .get(userController.getForgotPasswordPage)
    .put(userController.actionForgotPassword);

router.route('/logout')
    .get(userController.getLogoutPage)
    .put(userController.actionLogoutUser);

module.exports = router;