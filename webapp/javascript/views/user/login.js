(function(){

    var $ = jQuery,
        that = app.views.user.login,
        helpers = app.helpers,
        ajax = app.ajax,
        loginForm = $('#user-login-form'),
        loginSubmit = $('#login-submit'),
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
            if (!helpers.isValidPassword(formData.password)) {
                loginPasswordInput.addClass(errorClass);
            }
            if (!helpers.formHasErrors(loginForm)) {
                loginSubmit.addClass(disabledClass);
                ajax.ajax(
                    'PUT',
                    '/login',
                    {
                        action: 'api-login',
                        email: formData.email,
                        password: formData.password
                    },
                    'json'
                )
                    .then(function(response){
                        //todo, show success and then redirect
                        window.location.href = '/personal-profile';
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                        loginSubmit.removeClass(disabledClass);
                    });
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