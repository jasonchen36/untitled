(function(){

    var $ = jQuery,
        that = app.views.taxProfile.credits,
        helpers = app.helpers,
        taxProfile = app.services.taxProfile,
        creditsForm,
        creditsSubmit,
        creditsBack,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitCredits(){
        if (!creditsSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormData(creditsForm);
            if(!helpers.hasSelectedTile(formData)){
                //todo, real alert
                alert('no selected option');
            } else {
                creditsSubmit.addClass(disabledClass);
                app.ajax.ajax(
                    'POST',
                    '/tax-profile',
                    {
                        action: 'api-tp-credits',
                        data: formData
                    },
                    'json'
                )
                    .then(function(response){
                        taxProfile.goToNextPage(response.data);
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        console.log(jqXHR,textStatus,errorThrown);
                        creditsSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    this.init = function(){
        if ($('#tax-profile-credits').length > 0) {

            //variables
            creditsForm = $('#credits-form');
            creditsSubmit = $('#credits-submit');
            creditsBack = $('#credits-back');

            //listeners
            creditsForm.on('submit',function(event){
                event.preventDefault();
                submitCredits();
            });

            creditsSubmit.on('click',function(event){
                event.preventDefault();
                submitCredits();
            });

            creditsBack.on('click',function(event){
                event.preventDefault();
                taxProfile.goToPreviousPage();
            });
        }
    };

}).apply(app.views.taxProfile.credits);