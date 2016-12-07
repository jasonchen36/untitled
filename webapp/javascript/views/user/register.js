(function(){

    var $ = jQuery,
        that = app.views.user.register,
        helpers = app.helpers,
        ajax = app.ajax,
        registerForm = $('#user-register-form'),
        registerSubmit = $('#register-submit'),
        registerEmailInput = $('#register-email'),
        registerPasswordInput = $('#register-password'),
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitRegister(){
        if (!registerSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormData(registerForm);
            helpers.resetForm(registerForm);
            if (!helpers.isValidEmail(formData.email)) {
                registerEmailInput.addClass(errorClass);
            }
            if (!helpers.isValidPassword(formData.password)) {
                registerPasswordInput.addClass(errorClass);
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
                    'json'
                )
                    .then(function(response){
                        //todo, show success and then redirect
                        window.location.href = '/personal-profile';
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                        registerSubmit.removeClass(disabledClass);
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