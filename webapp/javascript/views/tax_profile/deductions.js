(function(){

    var $ = jQuery,
        that = app.views.taxProfile.deductions,
        helpers = app.helpers,
        taxProfile = app.services.taxProfile,
        deductionsForm,
        deductionsSubmit,
        deductionsBack,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitDeductions(){
        if (!deductionsSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormData(deductionsForm);
            if(!helpers.hasSelectedTile(formData)){
                //todo, real alert
                alert('no selected option');
            } else {
                deductionsSubmit.addClass(disabledClass);
                app.ajax.ajax(
                    'POST',
                    '/tax-profile',
                    {
                        action: 'api-tp-deductions',
                        data: formData
                    },
                    'json'
                )
                    .then(function(response){
                        taxProfile.goToNextPage(response.data);
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        console.log(jqXHR,textStatus,errorThrown);
                        deductionsSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    this.init = function(){
        if ($('#tax-profile-deductions').length > 0) {

            //variables
            deductionsForm = $('#deductions-form');
            deductionsSubmit = $('#deductions-submit');
            deductionsBack = $('#deductions-back');

            //listeners
            deductionsForm.on('submit',function(event){
               event.preventDefault();
               submitDeductions();
            });

            deductionsSubmit.on('click',function(event){
                event.preventDefault();
                submitDeductions();
            });

            deductionsBack.on('click',function(event){
                event.preventDefault();
                taxProfile.goToPreviousPage();
            });
        }
    };

}).apply(app.views.taxProfile.deductions);