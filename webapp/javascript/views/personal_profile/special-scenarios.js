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
        if (!specialScenariosSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormData(specialScenariosForm);
            if(!helpers.hasSelectedTile(formData)){
                //todo, real alert
                alert('no selected option');
            } else {
                specialScenariosSubmit.addClass(disabledClass);
                app.ajax.ajax(
                    'POST',
                    '/personal-profile',
                    {
                        action: 'api-pp-special-scenarios',
                        data: formData
                    },
                    'json'
                )
                    .then(function(response){
                        personalProfile.goToNextPage(response.data);
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        console.log(jqXHR,textStatus,errorThrown);
                        specialScenariosSubmit.removeClass(disabledClass);
                    });
            }
        }
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

            specialScenariosSubmit.on('click',function(event){
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