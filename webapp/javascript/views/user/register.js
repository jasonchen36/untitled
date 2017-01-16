(function(){

    var $ = jQuery,
        that = app.views.user.register,
        helpers = app.helpers,
        ajax = app.ajax,
        registerForm = $('#user-register-form'),
        registerSubmit = $('#register-submit'),
        registerEmailInput = $('#register-email'),
        registerPasswordInput = $('#register-password'),
        registerEmailConfirmInput = $('#register-confirm-email'),
        registerPasswordConfirmInput = $('#register-confirm-password'),
        registerErrorLabelEmail = $('#register-label-error-email'),
        registerErrorLabelConfirmEmail = $('#register-label-error-confirm-email'),
        registerErrorLabelPassword = $('#register-label-error-password'),
        registerErrorLabelConfirmPassword = $('#register-label-error-confirm-password'),
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitRegister(){
        registerEmailInput.removeClass(errorClass);
        registerErrorLabelEmail.removeClass(errorClass);
        registerPasswordInput.removeClass(errorClass);
        registerErrorLabelPassword.removeClass(errorClass);
        registerPasswordConfirmInput.removeClass(errorClass);
        registerErrorLabelConfirmPassword.removeClass(errorClass);
        registerEmailConfirmInput.removeClass(errorClass);
        registerErrorLabelConfirmEmail.removeClass(errorClass);

        if (!registerSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormData(registerForm);
            helpers.resetForm(registerForm);

            if (!helpers.isValidEmail(formData.email)) {
                registerEmailInput.addClass(errorClass);
                registerErrorLabelEmail.addClass(errorClass);
                registerErrorLabelEmail.html("Email must be xxx@xxx.xxx format");
            }
            if (!helpers.isValidPassword(formData.password)) {
                registerPasswordInput.addClass(errorClass);
                registerErrorLabelPassword.addClass(errorClass);
            }
            if (!helpers.isMatchingFields(formData.password, formData.confirmpassword)) {
                registerPasswordConfirmInput.addClass(errorClass);
                registerErrorLabelConfirmPassword.addClass(errorClass);
            }
            if (!helpers.isMatchingFields(formData.email, formData.confirmemail)) {
                registerEmailConfirmInput.addClass(errorClass);
                registerErrorLabelConfirmEmail.addClass(errorClass);
            }
            if (!helpers.formHasErrors(registerForm)) {
                registerSubmit.addClass(disabledClass);
                ajax.ajax(
                    'POST',
                    '/register',
                    {
                        action: 'api-register',
                        email: formData.email,
                        password: formData.password
                    },
                    'json',
                    { }
                )
                    .then(function(response){
                        //todo, show success and then redirect
                        window.location.href = '/personal-profile';
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                        registerSubmit.removeClass(disabledClass);
                        registerEmailInput.addClass(errorClass);
                        registerErrorLabelEmail.addClass(errorClass);

                        registerErrorLabelEmail.html("Email already in use");
                    });
            }
        }
    }

    this.init = function(){
        if ($('#page-user-register').length > 0){

            //listeners
            registerSubmit.on('click',function(event){
                event.preventDefault();
                submitRegister();
            });
        }
    };

}).apply(app.views.user.register);
