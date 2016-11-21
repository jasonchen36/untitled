(function(){

    var $ = jQuery,
        that = app.views.taxProfile.creditsMulti,
        helpers = app.helpers,
        taxProfile = app.services.taxProfile,
        creditsMultiForm,
        creditsMultiSubmit,
        creditsMultiBack,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitIncome(){
        //todo
        taxProfile.goToNextPage();
    }

    this.init = function(){
        if ($('#tax-profile-credits-multi').length > 0) {

            //variables
            creditsMultiForm = $('#credits-multi-form');
            creditsMultiSubmit = $('#credits-multi-submit');
            creditsMultiBack = $('#credits-multi-back');

            //listeners
            creditsMultiForm.on('submit',function(event){
                event.preventDefault();
                submitIncome();
            });

            creditsMultiBack.on('click',function(event){
                event.preventDefault();
                taxProfile.goToPreviousPage();
            });
        }
    };

}).apply(app.views.taxProfile.creditsMulti);