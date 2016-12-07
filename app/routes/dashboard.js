const //services
    express = require('express'),
    router = express.Router(),
//middleware
    authenticationMiddleware = require('../middleware/authentication'),
//controllers
    dashboardController = require('../controllers/dashboard');

router.route('/').get(dashboardController.getDashboardPage);

router.route('/document').put(dashboardController.actionAddNewDocument);

router.route('/chat').put(dashboardController.actionAddNewMessage);

module.exports = router;