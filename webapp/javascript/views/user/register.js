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
            if (formData.password.length < 1){
                registerPasswordInput.addClass(errorClass);
            }
            if (!helpers.formHasErrors(registerForm)) {
                console.log('submit register');
                registerSubmit.addClass(disabledClass);
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