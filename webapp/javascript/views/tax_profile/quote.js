(function(){

    var $ = jQuery,
        that = app.views.taxProfile.quote,
        helpers = app.helpers,
        taxProfile = app.services.taxProfile,
        quoteForm,
        quoteSubmit,
        quoteBack,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitQuote(){
        //todo
        window.location.href = '/register';
    }

    this.init = function(){
        if ($('#tax-profile-quote').length > 0) {

            //variables
            quoteForm = $('#quote-form');
            quoteSubmit = $('#quote-submit');
            quoteBack = $('#quote-back');

            //listeners
            quoteForm.on('submit',function(event){
                event.preventDefault();
                submitQuote();
            });

            quoteSubmit.on('click',function(event){
                event.preventDefault();
                submitQuote();
            });

            quoteBack.on('click',function(event){
                event.preventDefault();
                taxProfile.goToPreviousPage();
            });
        }
    };

}).apply(app.views.taxProfile.quote);