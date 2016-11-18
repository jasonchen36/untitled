(function(){

    var $ = jQuery,
        that = app.views.profile.pageTwo;

    this.init = function(){
        if ($('#page-profile-2').length > 0) {
            console.log('profile 2');
        }
    };

}).apply(app.views.profile.pageTwo);