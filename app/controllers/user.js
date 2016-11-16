const //services
    bookshelf = require('../services/bookshelf'),
    util = require('../services/util');

var userPages = {};

/************ login ************/
userPages.getLoginPage = function(req, res, next){
    var User = bookshelf.Model.extend({
        tableName: 'users'
    });

    User.where('id', 1)
        .fetch()
        .then(function(user) {
            // Update views
            req.session.views = (req.session.views || 0) + 1;

            res.render('user/login', {
                meta: {
                    pageTitle: util.globals.metaTitlePrefix+'Login'
                },
                data: {
                    name: user.toJSON().name,
                    views: req.session.views
                }
            });
        })
        .catch(function(error) {
            next(error);
        });
};

userPages.actionLoginUser = function(req, res, next){
    res.json({"action": "login"});
};

/************ register ************/
userPages.getRegisterPage = function(req, res, next){
    res.render('user/register', {
        meta: {
            pageTitle: util.globals.metaTitlePrefix + 'Register'
        },
        data: {}
    });
};

userPages.actionRegisterUser = function(req, res, next){
    res.json({"action": "register"});
};

module.exports = userPages;