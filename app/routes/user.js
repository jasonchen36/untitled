const express = require('express'),
    router = express.Router(),
//services
    bookshelf = require('../services/bookshelf');

router.route('/')
    .get(function(req, res, next) {

        var User = bookshelf.Model.extend({
            tableName: 'users'
        });

        User.where('id', 1)
            .fetch()
            .then(function(user) {
                // Update views
                req.session.views = (req.session.views || 0) + 1;

                res.render('home', {
                    name: user.toJSON().name,
                    views: req.session.views
                });
            })
            .catch(function(error) {
                next(error);
            });
    });

module.exports = router;