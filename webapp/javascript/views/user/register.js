(function(){

    var $ = jQuery,
        that = app.views.user.register,
        helpers = app.helpers,
        registerForm = $('#user-register-form'),
        registerSubmit = $('#register-form'),
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
                app.ajax.ajax(
                    'POST',
                    '/register',
                    {
                        email: formData.email,
                        password: formData.password
                    },
                    'json'
                )
                    .then(function(){
                        window.location.href = '/personal-profile';
                    })
                    .catch(function(){
                        alert('error');
                        registerSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    this.init = function(){
        if ($('#page-user-register').length > 0){

            //listeners
            registerForm.on('submit',function(event){
                event.preventDefault();
                submitRegister();
            });
        }
    };

}).apply(app.views.user.register);