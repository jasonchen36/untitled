(function(){

    var $ = jQuery,
        that = app.views.taxProfile.welcome,
        helpers = app.helpers,
        ajax = app.ajax,
        taxProfile = app.services.taxProfile,
        welcomeForm,
        welcomeSubmit,
        welcomeNameInput,
        welcomeErrorName,
        errorClass = helpers.errorClass,
        disabledClass = helpers.disabledClass;

    function submitWelcome(){
        if (!welcomeSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormData(welcomeForm);
            helpers.resetForm(welcomeForm);
            if (helpers.isEmpty(formData.firstName)){
                welcomeNameInput.addClass(errorClass);
                welcomeErrorName.addClass(errorClass);
            }
            if (!helpers.formHasErrors(welcomeForm)) {
                welcomeSubmit.addClass(disabledClass);
                ajax.ajax(
                    'POST',
                    '/tax-profile',
                    {
                        action: 'api-tp-welcome',
                        firstName: formData.firstName,
                        accountId: formData.accountId,
                    },
                    'json',
                     { }
                )
                    .then(function(response){
                        taxProfile.goToNextPage(response.data);
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
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
            welcomeErrorName = $('#welcome-label-error-name');

            //listeners
            welcomeSubmit.on('click',function(event){
                event.preventDefault();
                submitWelcome();
            });

            welcomeForm.on('submit',function(event){
                event.preventDefault();
                submitWelcome();
            });

            $(document).ready(function(){
                $(this).scrollTop(0);
            });
        }
    };

}).apply(app.views.taxProfile.welcome);
