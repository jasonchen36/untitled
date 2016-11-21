(function(){

    var $ = jQuery,
        that = app.views.taxProfile.incomeMulti,
        helpers = app.helpers,
        taxProfile = app.services.taxProfile,
        incomeMultiForm,
        incomeMultiSubmit,
        incomeMultiBack,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitIncomeMulti(){
        //todo
        taxProfile.goToNextPage();
    }

    this.init = function(){
        if ($('#tax-profile-income-multi').length > 0) {

            //variables
            incomeMultiForm = $('#income-multi-form');
            incomeMultiSubmit = $('#income-multi-submit');
            incomeMultiBack = $('#income-multi-back');

            //listeners
            incomeMultiForm.on('submit',function(event){
                event.preventDefault();
                submitIncomeMulti();
            });

            incomeMultiBack.on('click',function(event){
                event.preventDefault();
                taxProfile.goToPreviousPage();
            });
        }
    };

}).apply(app.views.taxProfile.incomeMulti);