(function(){

    var $ = jQuery,
        that = app.views.dashboard.myReturn,
        helpers = app.helpers,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    this.init = function(){
        if ($('#dashboard-my-return').length > 0) {
            //todo
            console.log('my return init');
        }
    };

}).apply(app.views.dashboard.myReturn);