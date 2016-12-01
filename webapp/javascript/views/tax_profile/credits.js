(function(){

    var $ = jQuery,
        that = app.views.taxProfile.credits,
        helpers = app.helpers,
        taxProfile = app.services.taxProfile,
        creditsForm,
        creditsSubmit,
        creditsBack,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitIncome(){
        //todo
        taxProfile.goToNextPage();
    }

    this.init = function(){
        if ($('#tax-profile-credits').length > 0) {

            //variables
            creditsForm = $('#credits-form');
            creditsSubmit = $('#credits-submit');
            creditsBack = $('#credits-back');

            //listeners
            creditsSubmit.on('click',function(event){
                event.preventDefault();
                submitIncome();
            });

            creditsBack.on('click',function(event){
                event.preventDefault();
                taxProfile.goToPreviousPage();
            });
        }
    };

}).apply(app.views.taxProfile.credits);