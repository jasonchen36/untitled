const //services
    express = require('express'),
    router = express.Router(),
//middleware
    authenticationMiddleware = require('../middleware/authentication'),
//controllers
    dashboardController = require('../controllers/dashboard');

router.route('/privacy-policy')
    .get(authenticationMiddleware.redirectWithoutUserSession,dashboardController.getPrivacyPage);

router.route('/terms-conditions')
    .get(authenticationMiddleware.redirectWithoutUserSession,dashboardController.getTermsPage);

router.route('/').get(dashboardController.getDashboardPage);

module.exports = router;