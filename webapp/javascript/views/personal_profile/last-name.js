(function(){

    var $ = jQuery,
        that = app.views.personalProfile.lastName,
        helpers = app.helpers,
        ajax = app.ajax,
        personalProfile = app.services.personalProfile,
        lastNameForm,
        lastNameSubmit,
        lastNameBack,
        lastNameInput,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitLastName(){
        if (!lastNameSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormData(lastNameForm);
            helpers.resetForm(lastNameForm);
            if (helpers.isEmpty(formData.name)){
                lastNameInput.addClass(errorClass);
            }
            if (!helpers.formHasErrors(lastNameForm)) {
                lastNameSubmit.addClass(disabledClass);
                ajax.ajax(
                    'POST',
                    '/personal-profile',
                    {
                        action: 'api-pp-last-name',
                        lastName: formData.name
                    },
                    'json'
                )
                    .then(function(response){
                        personalProfile.goToNextPage(response.data);
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                        lastNameSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    this.init = function(){
        if ($('#personal-profile-last-name').length > 0) {

            //variables
            lastNameForm = $('#last-name-form');
            lastNameSubmit = $('#last-name-submit');
            lastNameBack = $('#last-name-back');
            lastNameInput = $('#last-name-input');

            //listeners
            lastNameForm.on('submit',function(event){
                event.preventDefault();
                submitLastName();
            });

            lastNameSubmit.on('click',function(event){
                event.preventDefault();
                submitLastName();
            });
        }
    };

}).apply(app.views.personalProfile.lastName);