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

            quoteDetails = $('#quote-details');
            //listeners
            quoteForm.on('submit',function(event){
                event.preventDefault();
                submitQuote();
            });

            quoteDetails.on('click',function(event){
                event.preventDefault();
                submitQuote();
            });

            quoteDetails.on('mouseover',function(event){
                event.preventDefault();
                console.log('it is moused over');
                // TODO: Avoid hard-coding prices
                  $('#tax-profile-instructions').html('<div class="display-inline-table full-width">'+
                      '<p class="display-inline-block float-left">Self Employed</p>'+
                      '<p class="display-inline-block float-right">$19.00</p>'+
                  '</div>'+
                   '<div class="display-inline-table full-width">'+
                      '<p class="display-inline-block float-left">Capital Gains</p>'+
                      '<p class="display-inline-block float-right">$19.00</p>'+
                  '</div>'+
                  '<div class="display-inline-table full-width">'+
                      '<p class="display-inline-block float-left">Employee Related Expenses</p>'+
                      '<p class="display-inline-block float-right">$19.00</p>'+
                  '</div>'+
                  '<div class="display-inline-table full-width">'+
                      '<p class="display-inline-block float-left">Total</p>'+
                      '<p class="display-inline-block float-right">$19.00</p>'+
                  '</div>');
            });

            quoteBack.on('click',function(event){
                event.preventDefault();
                taxProfile.goToPreviousPage();
            });
        }
    };

}).apply(app.views.taxProfile.quote);
