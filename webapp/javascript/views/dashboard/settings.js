(function(){
    var $ = jQuery,
        that = app.views.user.passwordReset,
        helpers = app.helpers,
        ajax = app.ajax,
        apiservice = app.apiservice,
        userSettingsForm = $('#user-settings-form'),
        settingsEmailInput = $('#settings-email'),
        settingsPasswordInput = $('#settings-password'),
        settingsConfirmPasswordInput = $('settings-confirm-password'),
        settingsSubmit = $('#settings-submit'),
        settingsCancel = $('settings-cancel'),
        settingsEmailErrorLabel = $('#label-error-settings-email'),
        settingsPasswordErrorLabel = $('#label-error-settings-new-password'),
        settingsConfirmPasswordErrorLabel = $('#label-error-settings-confirm-password'),
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function updateEmailPassword(){
        if (!settingsSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormData(userSettingsForm);
            console.log(formData);
            helpers.resetForm(userSettingsForm);
            if (!helpers.isValidEmail(formData.email)) {
                settingsEmailInput.addClass(errorClass);
                settingsEmailErrorLabel.addClass(errorClass);
                settingsEmailErrorLabel.html('Please check your e-mail address');
            }
            if (!helpers.isValidPassword(formData.password)) {
                settingsPasswordInput.addClass(errorClass);
                settingsPasswordErrorLabel.addClass(errorClass);
                settingsPasswordErrorLabel.html('Please check your e-mail address');
            }
            if ((!helpers.isValidPassword(formData.password)) && (formData.password !== formData.password)) {
                settingsConfirmPasswordInput.addClass(errorClass);
                settingsConfirmPasswordErrorLabel.addClass(errorClass);
                settingsConfirmPasswordErrorLabel.html('Please check your e-mail address');
            }
            if (!helpers.formHasErrors(userSettingsForm)) {
               settingsSubmit.addClass(disabledClass);

               return Promise.resolve()
                    .then(function() {
                        var promiseArray =  [];

                       var ajaxCall = apiservice.putEmailPassword(apiUrl,
                                                                 formData.email, formData.password);
                       promiseArray.push(ajaxCall);

                       return Promise.all(promiseArray);

                    })
                    .then(function(response) {

                        //todo, show success and then redirect
                        window.location.href = '/dashboard';

                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                        settingsEmailErrorLabel.addClass(errorClass);
                        settingsEmailInput.addClass(errorClass);
                        settingsEmailErrorLabel.html(jqXHR.errorThrown);
                        settingsPasswordErrorLabel.addClass(errorClass);
                        settingsPasswordInput.addClass(errorClass);
                        settingsPasswordErrorLabel.html(jqXHR.errorThrown);
                        settingsConfirmPasswordErrorLabel.addClass(errorClass);
                        settingsConfirmPasswordInput.addClass(errorClass);
                        settingsCOnfirmPasswordErrorLabel.html(jqXHR.errorThrown);
                        settingsSubmit.removeClass(disabledClass);
                    });


            }
        }
    }

    this.init = function(){
        if ($('#user-settings').length > 0){

            //listeners
            userSettingsForm.on('submit',function(event){
                event.preventDefault();
                updateEmailPassword();
            });
        }
    };

}).apply(app.views.dashboard.myReturn);
