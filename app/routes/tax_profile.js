const //services
    express = require('express'),
    router = express.Router(),
//controllers
    taxProfileController = require('../controllers/tax_profile');

router.route('/')
    .get(taxProfileController.getPageTaxProfile)
    .post(taxProfileController.actionSaveTaxProfile);

router.route('/logout')
    .get(taxProfileController.getLogoutPage);

module.exports = router;