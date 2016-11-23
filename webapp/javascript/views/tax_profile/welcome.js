(function(){

    var $ = jQuery,
        that = app.views.taxProfile.welcome,
        helpers = app.helpers,
        taxProfile = app.services.taxProfile,
        welcomeForm,
        welcomeSubmit,
        welcomeNameInput,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitWelcome(){
        if (!welcomeSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormData(welcomeForm);
            helpers.resetForm(welcomeForm);
            if (formData.name.length < 1){
                welcomeNameInput.addClass(errorClass);
            }
            if (!helpers.formHasErrors(welcomeForm)) {
                welcomeSubmit.addClass(disabledClass);
                app.ajax.ajax(
                    'POST',
                    '/tax-profile',
                    {
                        action: 'api-tp-name',
                        name: formData.name
                    },
                    'json'
                )
                    .then(function(response){
                        taxProfile.updateAccountSession(response.data);
                        taxProfile.goToNextPage();
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        console.log(jqXHR,textStatus,errorThrown);
                        welcomeSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    this.init = function(){
        if ($('#tax-profile-welcome').length > 0) {

            //variables
            welcomeForm = $('#welcome-form');
            welcomeSubmit = $('#welcome-submit');
            welcomeNameInput = $('#welcome-name');

            //listeners
            welcomeForm.on('submit',function(event){
                event.preventDefault();
                submitWelcome();
            });
        }
    };

}).apply(app.views.taxProfile.welcome);