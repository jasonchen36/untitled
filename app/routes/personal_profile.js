const //services
    express = require('express'),
    router = express.Router(),
//middleware
    authenticationMiddleware = require('../middleware/authentication'),
//controllers
    personalProfileController = require('../controllers/personal_profile');

router.route('/privacy-policy')
    .get(authenticationMiddleware.redirectWithoutUserSession,personalProfileController.getPrivacyPage);

router.route('/terms-conditions')
    .get(authenticationMiddleware.redirectWithoutUserSession,personalProfileController.getTermsPage);

router.route('/')
    .get(personalProfileController.getPersonalProfilePage);

module.exports = router;