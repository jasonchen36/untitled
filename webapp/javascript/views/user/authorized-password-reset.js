(function(){

    var $ = jQuery,
        that = app.views.user.authorizedPasswordReset,
        helpers = app.helpers,
        ajax = app.ajax,
        passwordResetForm = $('#authorized-password-reset-form'),
        passwordResetPasswordInput = $('#authorized-password-reset-password'),
        passwordResetSubmit = $('#authorized-password-reset-submit'),
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitForgotPassword(){
        if (!passwordResetSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormData(passwordResetForm);
            helpers.resetForm(passwordResetForm);
            if (!helpers.isValidPassword(formData.password)) {
                passwordResetPasswordInput.addClass(errorClass);
            }
            if (!helpers.formHasErrors(passwordResetForm)) {
                passwordResetSubmit.addClass(disabledClass);
                ajax.ajax(
                    'PUT',
                    '/password-reset',
                    {
                        action: 'api-authorized-password-reset',
                        password: formData.password,
                        token: authToken
                    },
                    'json',
                    { }
                )
                    .then(function(response){
                        //todo, show success and then redirect
                        window.location.href = '/login';
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                        passwordResetSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    this.init = function(){
        if ($('#page-user-authorized-password-reset').length > 0){

            //listeners
            passwordResetForm.on('submit',function(event){
                event.preventDefault();
                submitForgotPassword();
            });
        }
    };

}).apply(app.views.user.authorizedPasswordReset);