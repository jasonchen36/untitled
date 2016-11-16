(function(){

    var $ = jQuery,
        that = app.views.user.login,
        helpers = app.helpers,
        loginForm = $('#user-login-form'),
        forgotPasswordForm = $('#forgot-password-form'),
        forgotPasswordEmailInput = $('#forgot-password-email'),
        errorClass = app.helpers.errorClass;

    function submitForgotPassword(){
        var formData = helpers.getFormData(forgotPasswordForm);
        helpers.resetForm(forgotPasswordForm);
        if (!helpers.isValidEmail(formData.email)){
            forgotPasswordEmailInput.addClass(errorClass);
        } else {
            console.log('submit forgot password');
        }
    }

    function submitLogin(){
        console.log('submit login');
    }

    this.init = function(){
        if ($('#page-user-login').length > 0){

            //listeners
            loginForm.on('submit',function(event){
                event.preventDefault();
                submitLogin();
            });

            forgotPasswordForm.on('submit',function(event){
                event.preventDefault();
                submitForgotPassword();
            });
        }
    };

}).apply(app.views.user.login);