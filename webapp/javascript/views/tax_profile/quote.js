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
                // TODO: Avoid hard-coding prices
                  $('#tax-profile-instructions').html('<div class="display-inline-table full-width">'+
                      '<p class="display-inline-block float-left">Lorem Ipsum</p>'+
                      '<p class="display-inline-block float-right">$19.00</p>'+
                  '</div>'+
                   '<div class="display-inline-table full-width">'+
                      '<p class="display-inline-block float-left">Lorem Ipsum</p>'+
                      '<p class="display-inline-block float-right">$19.00</p>'+
                  '</div>'+
                  '<div class="display-inline-table full-width">'+
                      '<p class="display-inline-block float-left">Lorem Ipsum</p>'+
                      '<p class="display-inline-block float-right">$19.00</p>'+
                  '</div>'+
                  '<div class="display-inline-table full-width">'+
                      '<p class="display-inline-block float-left">Total</p>'+
                      '<p class="display-inline-block float-right">$19.00</p>'+
                  '</div>');
            });

            quoteDetails.on('mouseout',function(event){
                event.preventDefault();
                // TODO: Avoid hard-coding prices
                  $('#tax-profile-instructions').html('<p id="tax-profile-instructions" class="side-info-blurb">'+
                      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris aliquam velit ut faucibus consequat. In hac habitasse platea dictumst. Proin at volutpat velit. Quisque congue varius nulla non aliquam. Integer condimentum dapibus ipsum, sit amet pharetra ligula aliquam sit amet. Praesent dui tortor, molestie et sodales non, vulputate in ligula. Curabitur nec justo tellus. Sed ac arcu porttitor, blandit sapien convallis, ultrices nisi. Duis aliquam iaculis nunc sed sodales. Phasellus cursus convallis scelerisque. Nulla consectetur, nunc at maximus tincidunt, mauris sapien vehicula libero, at bibendum metus dui ac magna. Donec tempus justo eu vestibulum dictum.'+
                  '</p>');
            });

            quoteBack.on('click',function(event){
                event.preventDefault();
                taxProfile.goToPreviousPage();
            });
        }
    };

}).apply(app.views.taxProfile.quote);
