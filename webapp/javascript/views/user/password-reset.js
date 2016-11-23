(function(){

    var $ = jQuery,
        that = app.views.user.passwordReset,
        helpers = app.helpers,
        passwordResetForm = $('#password-reset-form'),
        passwordResetEmailInput = $('#password-reset-email'),
        passwordResetSubmit = $('#password-reset-submit'),
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitForgotPassword(){
        if (!passwordResetSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormData(passwordResetForm);
            helpers.resetForm(passwordResetForm);
            if (!helpers.isValidEmail(formData.email)) {
                passwordResetEmailInput.addClass(errorClass);
            }
            if (!helpers.formHasErrors(passwordResetForm)) {
                passwordResetSubmit.addClass(disabledClass);
                app.ajax.ajax(
                    'POST',
                    '/password-reset',
                    {
                        action: 'api-password-reset',
                        email: formData.email
                    },
                    'json'
                )
                    .then(function(response){
                        //todo, show success and then redirect
                        window.location.href = '/login';
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        console.log(jqXHR,textStatus,errorThrown);
                        passwordResetSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    this.init = function(){
        if ($('#page-user-password-reset').length > 0){

            //listeners
            passwordResetForm.on('submit',function(event){
                event.preventDefault();
                submitForgotPassword();
            });
        }
    };

}).apply(app.views.user.passwordReset);