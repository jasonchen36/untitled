(function(){

    var $ = jQuery,
        that = app.views.user.passwordReset,
        helpers = app.helpers,
        ajax = app.ajax,
        apiservice = app.apiservice,
        passwordResetForm = $('#password-reset-form'),
        passwordResetEmailInput = $('#password-reset-email'),
        passwordResetSubmit = $('#password-reset-submit'),
        passwordResetErrorLabel = $('#label-error-password-reset'),
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitForgotPassword(){
        if (!passwordResetSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormData(passwordResetForm);
            helpers.resetForm(passwordResetForm);
            if (!helpers.isValidEmail(formData.email)) {
                passwordResetEmailInput.addClass(errorClass);
                passwordResetErrorLabel.addClass(errorClass);
                passwordResetErrorLabel.html('Please check your e-mail address');
            }
            if (!helpers.formHasErrors(passwordResetForm)) {
               passwordResetSubmit.addClass(disabledClass);

               return Promise.resolve()
                    .then(function() {
                        var promiseArray =  [];

                       var ajaxCall = apiservice.putRequestReset(apiUrl, 
                                                                 formData.email);
                       promiseArray.push(ajaxCall);
                      
                       return Promise.all(promiseArray);

                    })
                    .then(function(response) {

                        //todo, show success and then redirect
                        window.location.href = '/login';

                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                        passwordResetErrorLabel.addClass(errorClass);
                        passwordResetEmailInput.addClass(errorClass);
                        passwordResetErrorLabel.html(jqXHR.errorThrown);
                        passwordResetSubmit.removeClass(disabledClass);
                    });


            }
        }
    }


    function submitResetPassword(){
        if (!passwordResetSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormData(passwordResetForm);
            helpers.resetForm(passwordResetForm);
            if (!helpers.isValidEmail(formData.email)) {
                passwordResetEmailInput.addClass(errorClass);
            }
            if (!helpers.formHasErrors(passwordResetForm)) {

                passwordResetSubmit.addClass(disabledClass);
                ajax.ajax(
                    'POST',
                    '/password-reset',
                    {
                        action: 'api-password-reset',
                        email: formData.email
                    },
                    'json',
                    { }
                )
                    .then(function(response){
                        //todo, show success and then redirect
                        window.location.href = '/login';
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                        passwordResetSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    this.init = function(){
        if ($('#page-user-password-reset').length > 0){

            //listeners
            passwordResetForm.on('submit',function(event){
                event.preventDefault();
                submitForgotPassword();
            });
        }
    };

}).apply(app.views.user.passwordReset);