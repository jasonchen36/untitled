(function(){

    var $ = jQuery,
        that = app.views.personalProfile.specialScenarios,
        helpers = app.helpers,
        personalProfile = app.services.personalProfile,
        specialScenariosForm,
        specialScenariosSubmit,
        specialScenariosBack,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitSpecialScenarios(){
        //todo
        personalProfile.goToNextPage();
    }

    this.init = function(){
        if ($('#personal-profile-special-scenarios').length > 0) {

            //variables
            specialScenariosForm = $('#special-scenarios-form');
            specialScenariosSubmit = $('#special-scenarios-submit');
            specialScenariosBack = $('#special-scenarios-back');

            //listeners
            specialScenariosForm.on('submit',function(event){
                event.preventDefault();
                submitSpecialScenarios();
            });

            specialScenariosBack.on('click',function(event){
                event.preventDefault();
                personalProfile.goToPreviousPage();
            });
        }
    };

}).apply(app.views.personalProfile.specialScenarios);