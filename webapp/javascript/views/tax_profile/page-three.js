(function(){

    var $ = jQuery,
        that = app.views.profile.pageThree;

    this.init = function(){
        if ($('#page-profile-3').length > 0) {
            console.log('profile 3');
        }
    };

}).apply(app.views.profile.pageThree);