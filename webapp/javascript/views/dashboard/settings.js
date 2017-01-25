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

    function submitForgotPassword(){
        if (!settingsSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormData(userSettingsForm);
            helpers.resetForm(userSettingsForm);
            if (!helpers.isValidEmail(formData.email)) {
                settingsEmailInput.addClass(errorClass);
                settingsEmailErrorLabel.addClass(errorClass);
                settingsEmailErrorLabel.html('Please check your e-mail address');
            }
            if (!helpers.formHasErrors(userSettingsForm)) {
               settingsSubmit.addClass(disabledClass);

               return Promise.resolve()
                    .then(function() {
                        var promiseArray =  [];

                       var ajaxCall = apiservice.putRequestReset(apiUrl,
                                                                 formData.email);
                       promiseArray.push(ajaxCall);

                       return Promise.all(promiseArray);

                    })
                    .then(function(response) {

                        //todo, show success and then redirect
                        window.location.href = '/login';

                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                        settingsEmailErrorLabel.addClass(errorClass);
                        settingsEmailInput.addClass(errorClass);
                        settingsEmailErrorLabel.html(jqXHR.errorThrown);
                        settingsSubmit.removeClass(disabledClass);
                    });


            }
        }
    }

    this.init = function(){
        alert('this is working');
    };

}).apply(app.views.dashboard.myReturn);
