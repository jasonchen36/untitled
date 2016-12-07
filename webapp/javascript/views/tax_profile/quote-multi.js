(function(){

    var $ = jQuery,
        that = app.views.taxProfile.quoteMulti,
        helpers = app.helpers,
        taxProfile = app.services.taxProfile,
        quoteMultiForm,
        quoteMultiSubmit,
        quoteMultiBack,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitQuoteMulti(){
        //todo
        window.location.href = '/register';
    }

    this.init = function(){
        if ($('#tax-profile-quote-multi').length > 0) {

            //variables
            quoteMultiForm = $('#quote-multi-form');
            quoteMultiSubmit = $('#quote-multi-submit');
            quoteMultiBack = $('#quote-multi-back');

            //listeners
            quoteMultiForm.on('submit',function(event){
                event.preventDefault();
                submitQuoteMulti();
            });

            quoteMultiBack.on('click',function(event){
                event.preventDefault();
                taxProfile.goToPreviousPage();
            });
        }
    };

}).apply(app.views.taxProfile.quoteMulti);