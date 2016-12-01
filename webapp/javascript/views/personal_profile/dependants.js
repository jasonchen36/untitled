(function(){

    var $ = jQuery,
        that = app.views.personalProfile.dependants,
        helpers = app.helpers,
        personalProfile = app.services.personalProfile,
        dependantsForm,
        dependantsSubmit,
        dependantsBack,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitDependants(){
        //todo
        personalProfile.goToNextPage();
    }

    this.init = function(){
        if ($('#personal-profile-dependants').length > 0) {

            //variables
            dependantsForm = $('#dependants-form');
            dependantsSubmit = $('#dependants-submit');
            dependantsBack = $('#dependants-back');

            //listeners
            dependantsForm.on('submit',function(event){
                event.preventDefault();
                submitDependants();
            });

            dependantsSubmit.on('click',function(event){
                event.preventDefault();
                submitDependants();
            });

            dependantsBack.on('click',function(event){
                event.preventDefault();
                personalProfile.goToPreviousPage();
            });
        }
    };

}).apply(app.views.personalProfile.dependants);