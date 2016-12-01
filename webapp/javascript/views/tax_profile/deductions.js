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

    function submitIncome(){
        //todo
        taxProfile.goToNextPage();
    }

    this.init = function(){
        if ($('#tax-profile-deductions').length > 0) {

            //variables
            deductionsForm = $('#deductions-form');
            deductionsSubmit = $('#deductions-submit');
            deductionsBack = $('#deductions-back');

            //listeners
            deductionsSubmit.on('click',function(event){
                event.preventDefault();
                submitIncome();
            });

            deductionsBack.on('click',function(event){
                event.preventDefault();
                taxProfile.goToPreviousPage();
            });
        }
    };

}).apply(app.views.taxProfile.deductions);