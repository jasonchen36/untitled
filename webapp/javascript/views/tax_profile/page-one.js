(function(){

    var $ = jQuery,
        that = app.views.profile.pageOne;

    this.init = function(){
        if ($('#page-profile-1').length > 0) {
            console.log('profile 1');
        }
    };

}).apply(app.views.profile.pageOne);