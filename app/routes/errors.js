const express = require('express'),
    router = express.Router(),
    //services
    environment = require('../services/environment'),
//controllers
    errorController = require('../controllers/errors');

if(!environment.isProduction()){
    router.route('/500')
        .get(errorController.get500Page);

    router.route('/404')
        .get(errorController.get404Page);
}

module.exports = router;