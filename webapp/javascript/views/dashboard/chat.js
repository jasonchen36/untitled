(function(){

    var $ = jQuery,
        that = app.views.dashboard.chat,
        helpers = app.helpers,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    this.init = function(){
        if ($('#dashboard-chat').length > 0) {
            //todo
            console.log('chat init');
        }
    };

}).apply(app.views.dashboard.chat);