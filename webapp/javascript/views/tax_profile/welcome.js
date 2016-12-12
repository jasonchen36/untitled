(function(){

    var $ = jQuery,
        that = app.views.taxProfile.welcome,
        helpers = app.helpers,
        ajax = app.ajax,
        taxProfile = app.services.taxProfile,
        welcomeForm,
        welcomeSubmit,
        welcomeNameInput,
        errorClass = helpers.errorClass,
        disabledClass = helpers.disabledClass;

    function submitWelcome(){
        if (!welcomeSubmit.hasClass(disabledClass)) {
            var accountSession = taxProfile.getAccountSession(),
                formData = helpers.getFormData(welcomeForm),
                firstName = formData.hasOwnProperty(accountSession.users[0].id)?formData[accountSession.users[0].id].name:'';
            helpers.resetForm(welcomeForm);
            if (helpers.isEmpty(firstName)){
                welcomeNameInput.addClass(errorClass);
            }
            if (!helpers.formHasErrors(welcomeForm)) {
                welcomeSubmit.addClass(disabledClass);
                ajax.ajax(
                    'POST',
                    '/tax-profile',
                    {
                        action: 'api-tp-welcome',
                        firstName: firstName
                    },
                    'json'
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

            //listeners
            welcomeSubmit.on('click',function(event){
                event.preventDefault();
                submitWelcome();
            });

            welcomeForm.on('submit',function(event){
                event.preventDefault();
                submitWelcome();
            });
        }
    };

}).apply(app.views.taxProfile.welcome);