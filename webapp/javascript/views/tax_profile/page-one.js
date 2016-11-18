(function(){

    var $ = jQuery,
        that = app.views.profile.pageOne,
        helpers = app.helpers,
        pageOneForm = $('#profile-1-form'),
        pageOneSubmit = $('#profile-1-submit'),
        pageOneNameInput = $('#profile-1-name'),
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitPageOne(){
        if (!pageOneSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormData(pageOneForm);
            helpers.resetForm(pageOneForm);
            if (formData.name.length < 1){
                pageOneNameInput.addClass(errorClass);
            }
            if (!helpers.formHasErrors(pageOneForm)) {
                pageOneSubmit.addClass(disabledClass);
                app.ajax.ajax(
                    'PUT',
                    '/tax-profile/1',
                    {
                        name: formData.name
                    },
                    'json'
                )
                    .then(function(){
                        window.location.href = '/tax-profile/2';
                    })
                    .catch(function(){
                        alert('error');
                        pageOneSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    this.init = function(){
        if ($('#page-profile-1').length > 0) {

            //listeners
            pageOneForm.on('submit',function(event){
                event.preventDefault();
                submitPageOne();
            });
        }
    };

}).apply(app.views.profile.pageOne);