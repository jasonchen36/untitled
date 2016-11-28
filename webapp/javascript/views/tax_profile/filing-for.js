(function(){

    var $ = jQuery,
        that = app.views.taxProfile.filingFor,
        helpers = app.helpers,
        taxProfile = app.services.taxProfile,
        filingForForm,
        filingForSubmit,
        filingForBack,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitFilingFor(){
        if (!filingForSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormData(filingForForm);
            helpers.resetForm(filingForForm);
            if (!helpers.hasCheckedCheckboxes(formData)){
                alert('no selected option');
            } else {
                filingForSubmit.addClass(disabledClass);
                app.ajax.ajax(
                    'POST',
                    '/tax-profile',
                    {
                        action: 'api-tp-filingType',
                        myself: formData.myself,
                        spouse: formData.spouse,
                        other: formData.other
                    },
                    'json'
                )
                    .then(function(response){
                        taxProfile.updateAccountSession(response.data);
                        taxProfile.goToNextPage();
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        console.log(jqXHR,textStatus,errorThrown);
                        filingForSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    this.init = function(){
        if ($('#tax-profile-filing-for').length > 0) {
            
            //variables
            filingForForm = $('#filing-for-form');
            filingForSubmit = $('#filing-for-submit');
            filingForBack = $('#filing-for-back');

            //listeners
            filingForForm.on('submit',function(event){
                event.preventDefault();
                submitFilingFor();
            });

            filingForBack.on('click',function(event){
                event.preventDefault();
                taxProfile.goToPreviousPage();
            });
        }
    };

}).apply(app.views.taxProfile.filingFor);