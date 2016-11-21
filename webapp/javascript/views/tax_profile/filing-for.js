(function(){

    var $ = jQuery,
        that = app.views.taxProfile.filingFor,
        helpers = app.helpers,
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
                        action: 'filingType',
                        myself: formData.myself,
                        spouse: formData.spouse,
                        other: formData.other
                    },
                    'json'
                )
                    .then(function(){
                        console.log('done');
                    })
                    .catch(function(){
                        alert('error');
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