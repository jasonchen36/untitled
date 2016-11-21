(function(){

    var $ = jQuery,
        that = app.views.dashboard.upload,
        helpers = app.helpers,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    this.init = function(){
        if ($('#dashboard-upload').length > 0) {
            //todo
            console.log('upload init');
        }
    };

}).apply(app.views.dashboard.upload);