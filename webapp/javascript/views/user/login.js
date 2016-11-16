(function(){

    var $ = jQuery,
        that = app.views.user.login,
        helpers = app.helpers,
        loginForm = $('#user-login-form'),
        loginSubmit = $('#login-form'),
        loginEmailInput = $('#login-email'),
        loginPasswordInput = $('#login-password'),
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitLogin(){
        if (!loginSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormData(loginForm);
            helpers.resetForm(loginForm);
            if (!helpers.isValidEmail(formData.email)) {
                loginEmailInput.addClass(errorClass);
            }
            if (formData.password.length < 1){
                loginPasswordInput.addClass(errorClass);
            }
            if (!helpers.formHasErrors(loginForm)) {
                console.log('submit login');
                loginSubmit.addClass(disabledClass);
            }
        }
    }

    this.init = function(){
        if ($('#page-user-login').length > 0){

            //listeners
            loginForm.on('submit',function(event){
                event.preventDefault();
                submitLogin();
            });
        }
    };

}).apply(app.views.user.login);