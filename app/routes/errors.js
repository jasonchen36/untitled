const express = require('express'),
    router = express.Router(),
    //services
    util = require('../services/util'),
//controllers
    errorController = require('../controllers/errors');

if(!util.environment.isProduction()){
    router.route('/500')
        .get(errorController.get500Page);

    router.route('/404')
        .get(errorController.get404Page);
}

module.exports = router;