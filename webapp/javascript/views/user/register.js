(function(){

    var $ = jQuery,
        that = app.views.user.register;

    this.init = function(){
        if ($('#user-register').length > 0){
            console.log('register page');
        }
    };

}).apply(app.views.user.register);