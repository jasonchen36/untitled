(function(){

    var $ = jQuery,
        that = app.views.taxProfile.incomeMulti,
        helpers = app.helpers,
        taxProfile = app.services.taxProfile,
        incomeMultiForm,
        incomeMultiSubmit,
        incomeMultiBack,
        incomeOptions,
        activeClass = app.helpers.activeClass,
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
            incomeOptions = $('.tp-income-option');

            //listeners
            incomeMultiForm.on('submit',function(event){
                event.preventDefault();
                submitIncomeMulti();
            });

            incomeMultiBack.on('click',function(event){
                event.preventDefault();
                taxProfile.goToPreviousPage();
            });

            incomeOptions.on('click',function(event){
                event.preventDefault();
                $(this).toggleClass(activeClass);
            });
        }
    };

}).apply(app.views.taxProfile.incomeMulti);