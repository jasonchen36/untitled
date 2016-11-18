(function(){

    var $ = jQuery,
        that = app.views.profile.pageQuote;

    this.init = function(){
        if ($('#page-profile-quote').length > 0) {
            console.log('profile quote');
        }
    };

}).apply(app.views.profile.pageQuote);