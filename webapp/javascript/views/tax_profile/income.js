(function(){

    var $ = jQuery,
        that = app.views.taxProfile.income,
        helpers = app.helpers,
        taxProfile = app.services.taxProfile,
        incomeForm,
        incomeSubmit,
        incomeBack,
        incomeOptions,
        activeClass = app.helpers.activeClass,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitIncome(){
        //todo
        taxProfile.goToNextPage();
    }

    this.init = function(){
        if ($('#tax-profile-income').length > 0) {

            //variables
            incomeForm = $('#income-form');
            incomeSubmit = $('#income-submit');
            incomeBack = $('#income-back');
            incomeOptions = $('.tp-income-option');

            //listeners
            incomeForm.on('submit',function(event){
                event.preventDefault();
                submitIncome();
            });

            incomeBack.on('click',function(event){
                event.preventDefault();
                taxProfile.goToPreviousPage();
            });

            incomeOptions.on('click',function(event){
                event.preventDefault();
                $(this).toggleClass(activeClass);
            });
        }
    };

}).apply(app.views.taxProfile.income);