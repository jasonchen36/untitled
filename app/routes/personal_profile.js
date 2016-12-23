const //services
    express = require('express'),
    router = express.Router(),
//middleware
    authenticationMiddleware = require('../middleware/authentication'),
//controllers
    personalProfileController = require('../controllers/personal_profile');

router.route('/')
    .get(personalProfileController.getPersonalProfilePage);

module.exports = router;