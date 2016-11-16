var errorPages = {};

errorPages.get404Page = function(req, res, next){
    res.render('errors/404',{
        layout: 'layout-error'
    });
};

errorPages.get500Page = function(req, res, next){
    res.render('errors/500',{
        layout: 'layout-error'
    });
};

module.exports = errorPages;