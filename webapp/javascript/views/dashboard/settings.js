(function(){
    var $ = jQuery,
        that = app.views.user.passwordReset,
        helpers = app.helpers,
        ajax = app.ajax,
        apiservice = app.apiservice,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function updateEmailPassword(settingsSubmit, userId, apiUrl){
        var userSettingsForm = $('#user-settings-form'),
        settingsEmailInput = $('#settings-email'),
        settingsPasswordInput = $('#settings-password'),
        settingsConfirmPasswordInput = $('#settings-confirm-password'),
        settingsEmailErrorLabel = $('#label-error-settings-email'),
        settingsPasswordErrorLabel = $('#label-error-settings-new-password'),
        settingsConfirmPasswordErrorLabel = $('#label-error-settings-confirm-password');
        console.log("this is the userId", userId,apiUrl);
        if (!settingsSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormData(userSettingsForm);
            console.log(formData);
            helpers.resetForm(userSettingsForm);
            if (!helpers.isValidEmail(formData.email)) {
                settingsEmailInput.addClass(errorClass);
                settingsEmailErrorLabel.addClass(errorClass);
                settingsEmailErrorLabel.html('Please check your e-mail address');
            }
            if (!helpers.isValidPassword(formData.password)) {
                settingsPasswordInput.addClass(errorClass);
                settingsPasswordErrorLabel.addClass(errorClass);
                settingsPasswordErrorLabel.html('Please check your password');
            }
            if ((!helpers.isValidPassword(formData.confirmedPassword)) && (formData.confirmedPassword !== formData.password)) {
                settingsConfirmPasswordInput.addClass(errorClass);
                settingsConfirmPasswordErrorLabel.addClass(errorClass);
                settingsConfirmPasswordErrorLabel.html('Please check your confirmed password');
            }
            if (!helpers.formHasErrors(userSettingsForm)) {
               settingsSubmit.addClass(disabledClass);

               return Promise.resolve()
                    .then(function() {
                        var promiseArray =  [];

                       var ajaxCall = apiservice.putEmailPassword(userId, apiUrl, formData.email, formData.password);
                       promiseArray.push(ajaxCall);

                       return Promise.all(promiseArray);

                    })
                    .then(function(response) {

                        //todo, show success and then redirect
                        window.location.href = '/dashboard';

                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                        settingsEmailErrorLabel.addClass(errorClass);
                        settingsEmailInput.addClass(errorClass);
                        settingsEmailErrorLabel.html(jqXHR.errorThrown);
                        settingsPasswordErrorLabel.addClass(errorClass);
                        settingsPasswordInput.addClass(errorClass);
                        settingsPasswordErrorLabel.html(jqXHR.errorThrown);
                        settingsConfirmPasswordErrorLabel.addClass(errorClass);
                        settingsConfirmPasswordInput.addClass(errorClass);
                        settingsConfirmPasswordErrorLabel.html(jqXHR.errorThrown);
                        settingsSubmit.removeClass(disabledClass);
                    });


            }
        }
    }

    this.init = function(){
        if ($('#user-settings').length > 0){

            var settingsSubmit = $('#settings-submit'),
            settingsCancel = $('#settings-cancel');
            //listeners
            settingsSubmit.on('submit',function(event){
                event.preventDefault();
                var userId = $(this).attr('data-id');
                var apiUrl = $(this).attr('url');
                updateEmailPassword($(this), userId, apiUrl);
            });

            settingsSubmit.on('click',function(event){
                event.preventDefault();
                var userId = $(this).attr('data-id');
                var apiUrl = $(this).attr('url');
                updateEmailPassword($(this), userId, apiUrl);
            });

            settingsCancel.on('click',function(event){
                event.preventDefault();
                changePageHelper('chat');
                document.getElementById('dashboard-upload-activate').classList.remove('active');
                document.getElementById('dashboard-my-return-activate').classList.remove('active');
                document.getElementById('dashboard-chat-activate').classList.add('active');
            });
        }
    };

}).apply(app.views.dashboard.settings);
