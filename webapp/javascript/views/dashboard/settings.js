(function(){
    var $ = jQuery,
        that = app.views.user.passwordReset,
        helpers = app.helpers,
        ajax = app.ajax,
        apiservice = app.apiservice,
        userSettingsForm = $('#user-settings-form'),
        passwordResetEmailInput = $('#password-reset-email'),
        passwordResetSubmit = $('#password-reset-submit'),
        passwordResetErrorLabel = $('#label-error-password-reset'),
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitForgotPassword(){
        if (!passwordResetSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormData(userSettingsForm);
            helpers.resetForm(userSettingsForm);
            if (!helpers.isValidEmail(formData.email)) {
                passwordResetEmailInput.addClass(errorClass);
                passwordResetErrorLabel.addClass(errorClass);
                passwordResetErrorLabel.html('Please check your e-mail address');
            }
            if (!helpers.formHasErrors(userSettingsForm)) {
               passwordResetSubmit.addClass(disabledClass);

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
                        passwordResetErrorLabel.addClass(errorClass);
                        passwordResetEmailInput.addClass(errorClass);
                        passwordResetErrorLabel.html(jqXHR.errorThrown);
                        passwordResetSubmit.removeClass(disabledClass);
                    });


            }
        }
    }

    this.init = function(){
        alert('this is working');
    };

}).apply(app.views.dashboard.myReturn);
