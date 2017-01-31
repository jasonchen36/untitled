(function(){
    var $ = jQuery,
        that = app.views.user.passwordReset,
        helpers = app.helpers,
        ajax = app.ajax,
        apiservice = app.apiservice,
        errorClass = app.helpers.errorClass,
        dashboard = app.services.dashboard,
        disabledClass = app.helpers.disabledClass;

    function updateEmailPassword(settingsSubmit, userId, userObject){
        var userSettingsForm = $('#user-settings-form'),
        settingsEmailInput = $('#settings-email'),
        settingsConfirmEmailInput = $('#settings-confirm-email'),
        settingsPasswordInput = $('#settings-password'),
        settingsConfirmPasswordInput = $('#settings-confirm-password'),
        settingsEmailErrorLabel = $('#label-error-settings-email'),
        settingsPasswordErrorLabel = $('#label-error-settings-new-password'),
        settingsConfirmPasswordErrorLabel = $('#label-error-settings-confirm-password');
        settingsConfirmEmailErrorLabel = $('label-error-settings-confirm-email');
        if (!settingsSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormData(userSettingsForm);
            helpers.resetForm(userSettingsForm);
            if (!helpers.isValidEmail(formData.email) && formData.email !== "") {
                settingsEmailInput.addClass(errorClass);
                settingsEmailErrorLabel.addClass(errorClass);
                settingsEmailErrorLabel.html('Please check your e-mail address');
            }
            if (((!helpers.isValidEmail(formData.confirmedEmail)) || (formData.confirmedEmail !== formData.email)) && formData.confirmedEmail !== "") {
                settingsEmailInput.addClass(errorClass);
                settingsEmailErrorLabel.addClass(errorClass);
                settingsConfirmEmailErrorLabel.html('Please check your confirmed e-mail address');
            }
            if (!helpers.isValidPassword(formData.password) && formData.password !== "") {
                settingsPasswordInput.addClass(errorClass);
                settingsPasswordErrorLabel.addClass(errorClass);
                settingsPasswordErrorLabel.html('Please check your password');
            }
            if (((!helpers.isValidPassword(formData.confirmedPassword)) || (formData.confirmedPassword !== formData.password)) && formData.confirmedPassword !== "") {
                settingsConfirmPasswordInput.addClass(errorClass);
                settingsConfirmPasswordErrorLabel.addClass(errorClass);
                settingsConfirmPasswordErrorLabel.html('Please check your confirmed password');
            }
            if (!helpers.formHasErrors(userSettingsForm)) {
               settingsSubmit.addClass(disabledClass);

               return Promise.resolve()
                    .then(function() {
                        var promiseArray =  [];

                       var ajaxCall = apiservice.putEmailPassword(userId, formData.email, formData.password, userObject);
                       promiseArray.push(ajaxCall);

                       return Promise.all(promiseArray);

                    })
                    .then(function(response) {
                        var dataObject = dashboard.getUserSession();
                        dataObject.currentPage = "chat";
                        dashboard.changePage('chat', dataObject);
                        window.location.href = '/logout';
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                        settingsEmailErrorLabel.addClass(errorClass);
                        settingsEmailInput.addClass(errorClass);
                        settingsConfirmEmailInput.addClass(errorClass);
                        settingsEmailErrorLabel.html(jqXHR.errorThrown);
                        settingsConfirmEmailErrorLabel.addClass(errorClass);
                        settingsConfirmEmailErrorLabel.html(jqXHR.errorThrown);
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
            settingsCancel = $('#settings-done'),
            settingsYesConfirm = $('#settings-confirm-button-yes');

            //listeners
            settingsSubmit.on('submit',function(event){
                event.preventDefault();
                if (confirm("Are you sure you want to save your changes?") === true) {
                    var userId = $(this).attr('data-id');
                    updateEmailPassword($(this), userId, userObject);
                }
            });

            settingsSubmit.on('click',function(event){
                event.preventDefault();
                window.location.hash = 'settings-confirm-modal';
            });

            settingsYesConfirm.on('click',function(event){
                event.preventDefault();
                var userId = $(this).attr('data-id');
                updateEmailPassword($(this), userId, userObject);
                window.location.hash = '#!';
            });

            settingsCancel.on('click',function(event){
                event.preventDefault();
                var dataObject = dashboard.getUserSession();
                dataObject.currentPage = "chat";
                dashboard.changePage('chat', dataObject);
            });
        }
    };

}).apply(app.views.dashboard.settings);
