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
                                  // console.log(formData);
            helpers.resetForm(loginForm);
            if (!helpers.isValidEmail(formData.email)) {
                loginEmailInput.addClass(errorClass);
                loginErrorLabelEmail.addClass(errorClass);
            }
            if (!helpers.isValidPassword(formData.password)) {
                loginPasswordInput.addClass(errorClass);
                loginErrorLabelPassword.addClass(errorClass);
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
                      console.log(response);
                        //todo, show success and then redirect
                        window.location.href = '/personal-profile';
                        console.log(window.location.href.taxReturns);
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
          var formData = helpers.getFormData(loginForm);
                                console.log(formData);
                                var personalProfile = app.services.personalProfile;
                                console.log(personalProfile);
                                taxProfile = app.services.taxProfile;
                                console.log(taxProfile);
                                var sessionData = personalProfile.getPersonalProfileSession();
                                console.log(sessionData);
                    var taxReturns = apiService.getTaxReturns(sessionData);
                    console.log(taxReturns);
            //listeners
            loginForm.on('submit',function(event){
                event.preventDefault();
                submitLogin();
            });
        }
    };

}).apply(app.views.user.login);
