(function(){

    var $ = jQuery,
        that = app.views.taxProfile.deductionsMulti,
        helpers = app.helpers,
        taxProfile = app.services.taxProfile,
        deductionsMultiForm,
        deductionsMultiSubmit,
        deductionsMultiBack,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitDeductionsMulti(){
        //todo
        taxProfile.goToNextPage();
    }

    this.init = function(){
        if ($('#tax-profile-deductions-multi').length > 0) {

            //variables
            deductionsMultiForm = $('#deductions-multi-form');
            deductionsMultiSubmit = $('#deductions-multi-submit');
            deductionsMultiBack = $('#deductions-multi-back');

            //listeners
            deductionsMultiForm.on('submit',function(event){
                event.preventDefault();
                submitDeductionsMulti();
            });

            deductionsMultiBack.on('click',function(event){
                event.preventDefault();
                taxProfile.goToPreviousPage();
            });
        }
    };

}).apply(app.views.taxProfile.deductionsMulti);