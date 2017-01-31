(function(){

    var $ = jQuery,
        that = app.views.user.login,
        helpers = app.helpers,
        ajax = app.ajax,
        loginForm = $('#user-login-form'),
        loginSubmit = $('#login-submit'),
        apiService = app.apiservice,
        loginEmailInput = $('#login-email'),
        loginPasswordInput = $('#login-password'),
        loginErrorLabelEmail = $('#label-error-email'),
        loginErrorLabelPassword = $('#label-error-password'),
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitLogin(){
        if (!loginSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormData(loginForm);
            helpers.resetForm(loginForm);
            if (!helpers.isValidEmail(formData.email)) {
                loginEmailInput.addClass(errorClass);
                loginErrorLabelEmail.addClass(errorClass);
                loginErrorLabelEmail.html('Oops! That email / password combination is not valid');
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
                    'json',
		    { }
                )
                    .then(function(response){
                        //todo, show success and then redirect
                        window.location.href = response.forward;
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){



                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                        loginPasswordInput.addClass(errorClass);
                        loginErrorLabelPassword.addClass(errorClass);
                        if (jqXHR.jqXHR.responseJSON.message[0].msg === 'You are a migrated user. Please reset your password.'){
                          loginErrorLabelPassword.html('You are a migrated user. Please reset your password.');
                        }else{
                          loginEmailInput.addClass(errorClass);
                          loginErrorLabelPassword.html('Please check your password');
                          loginErrorLabelEmail.addClass(errorClass);
                          loginErrorLabelEmail.html('Please check your e-mail address');
                        }
                        loginSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    this.init = function(){
        if ($('#page-user-login').length > 0){
          var formData = helpers.getFormData(loginForm);

            //listeners
            loginForm.on('submit',function(event){
                event.preventDefault();
                submitLogin();
            });
        }
    };

}).apply(app.views.user.login);
