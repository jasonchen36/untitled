(function(){

    var $ = jQuery,
        that = app.views.taxProfile.quoteApplies,
        helpers = app.helpers,
        ajax = app.ajax,
        taxProfile = app.services.taxProfile,
        quoteAppliesForm,
        quoteAppliesSubmit,
        quoteAppliesBack,
        activeClass = helpers.activeClass,
        errorClass = helpers.errorClass,
        disabledClass = helpers.disabledClass;

    function submitQuoteApplies(){
        if (!quoteAppliesSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormData(quoteAppliesForm);
            if(!helpers.hasSelectedTile(formData)){
                //todo, real alert
                alert('no selected option');
            } else if(helpers.noneAppliedMultipleSelectedTiles(formData)) {
                //todo, real alert
                alert('cannot select None Apply with other options');
            } else {
                quoteAppliesSubmit.addClass(disabledClass);
                ajax.ajax(
                    'POST',
                    '/tax-profile',
                    {
                        action: 'api-tp-quote-applies',
                        data: formData
                    },
                    'json'
                )
                    .then(function(response){
                        taxProfile.goToNextPage(response.data);
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                        quoteAppliesSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    this.init = function(){
        if ($('#tax-profile-quote-applies').length > 0) {

            //variables
            quoteAppliesForm = $('#quote-applies-form');
            quoteAppliesSubmit = $('#quote-applies-submit');
            quoteAppliesBack = $('#quote-applies-back');

            //listeners
            quoteAppliesForm.on('submit',function(event){
                event.preventDefault();
                submitQuoteApplies();
            });

            quoteAppliesSubmit.on('click',function(event){
                event.preventDefault();
                submitQuoteApplies();
            });

            quoteAppliesBack.on('click',function(event){
                event.preventDefault();
                taxProfile.goToPreviousPage();
            });
        }
    };

}).apply(app.views.taxProfile.quoteApplies);
