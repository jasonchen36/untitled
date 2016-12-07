(function(){

    var $ = jQuery,
        that = app.views.taxProfile.modalQuote,
        helpers = app.helpers,
        taxProfile = app.services.taxProfile,
        quoteForm,
        quoteSubmit,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitModalQuote(){
        //todo
        if(confirm('register?')){
            window.location.hash = '';
            window.location.href = '/register';
        }
    }

    this.init = function(){
        if ($('#modal-tax-profile-quote').length > 0) {

            //variables
            quoteForm = $('#modal-tax-profile-quote-form');
            quoteSubmit = $('#modal-tax-profile-quote-submit');

            //listeners
            quoteForm.on('submit',function(event){
                event.preventDefault();
                submitModalQuote();
            });

            quoteSubmit.on('click',function(event){
                event.preventDefault();
                submitModalQuote();
            });
        }
    };

}).apply(app.views.taxProfile.modalQuote);