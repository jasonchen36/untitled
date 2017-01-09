(function(){

    var $ = jQuery,
        that = app.views.taxProfile.quote,
        helpers = app.helpers,
        taxProfile = app.services.taxProfile,
        quoteForm,
        quoteSubmit,
        quoteBack,
        quoteDetails,
        quoteModalContainer,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitQuote(){
        window.location.href = '/register';
    }

    function openQuoteDetails(element){
        var quoteDetailIndex = element.attr('data-quote-index'),
            taxProfileSession = taxProfile.getAccountSession(),
            data = {
                firstName: taxProfileSession.users[quoteDetailIndex].firstName,
                lineItems: taxProfileSession.quote.lineItems
            },
            template = Handlebars.templates['tax-profile-quote'],
            html = template(data);
        quoteModalContainer.html(html);
        window.location.hash = 'modal-tax-profile-quote';
    }

    this.init = function(){
        if ($('#tax-profile-quote').length > 0) {

            //variables
            quoteForm = $('#quote-form');
            quoteSubmit = $('#quote-submit');
            quoteBack = $('#quote-back');
            quoteDetails = $('.quote-details');
            quoteModalContainer = $('#modal-tax-profile-quote');

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

            quoteDetails.on('click',function(event){
                event.preventDefault();
                openQuoteDetails($(this));
            });

            $(document).ready(function(){
                $(this).scrollTop(0);
            });
        }
    };

}).apply(app.views.taxProfile.quote);