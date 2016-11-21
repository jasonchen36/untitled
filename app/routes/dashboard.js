const //services
    express = require('express'),
    router = express.Router(),
//middleware
    authenticationMiddleware = require('../middleware/authentication'),
//controllers
    dashboardController = require('../controllers/dashboard');

router.route('/').get(dashboardController.getDashboardPage);

module.exports = router;