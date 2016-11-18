(function(){

    var $ = jQuery,
        that = app.views.user.forgotPassword,
        helpers = app.helpers,
        forgotPasswordForm = $('#forgot-password-form'),
        forgotPasswordEmailInput = $('#forgot-password-email'),
        forgotPasswordSubmit = $('#forgot-password-submit'),
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitForgotPassword(){
        if (!forgotPasswordSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormData(forgotPasswordForm);
            helpers.resetForm(forgotPasswordForm);
            if (!helpers.isValidEmail(formData.email)) {
                forgotPasswordEmailInput.addClass(errorClass);
            }
            if (!helpers.formHasErrors(forgotPasswordForm)) {
                forgotPasswordSubmit.addClass(disabledClass);
                app.ajax.ajax(
                    'PUT',
                    apiUrl+'users/reset',
                    {
                        email: formData.email
                    },
                    'json'
                )
                    .then(function(){
                        window.location.href = '/login';
                    })
                    .catch(function(){
                        alert('error');
                        forgotPasswordSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    this.init = function(){
        if ($('#page-user-forgot-password').length > 0){

            //listeners
            forgotPasswordForm.on('submit',function(event){
                event.preventDefault();
                submitForgotPassword();
            });
        }
    };

}).apply(app.views.user.forgotPassword);