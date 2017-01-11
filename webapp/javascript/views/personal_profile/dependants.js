(function(){

    var dependantsSubmit,
        dependantsBack,
        dependantsTiles,
        dependantsEditButtons,
        dependantsDeleteButtons,
        dependantsAddButtons,
        dependantsSaveButtons,
        dependantsCancelButtons,
        dependantCheckboxes,
        helpers = app.helpers,
        dependants_helpers = app.dependants_helpers;

    this.init = function(){
        if ($('#personal-profile-dependants').length > 0) {
            //variables
            dependantsSubmit = $('#dependants-submit');
            dependantsForm = $('#dependants-form');
            dependantsBack = $('#dependants-back');
            dependantsTiles = $('.'+helpers.tileClass);
            dependantsEditButtons = $('.dependants-button-edit');
            dependantsDeleteButtons = $('.dependants-button-delete');
            dependantsAddButtons = $('.dependants-button-add');
            dependantsSaveButtons = $('.dependants-button-save');
            dependantsCancelButtons = $('.dependants-button-cancel');
            dependantCheckboxes = $('.checkbox-container');

            //listeners
            dependantsBack.on('click',function(event){
                event.preventDefault();
                dependants_helpers.goToPreviousScreen(dependantsSubmit, dependantsForm);
            });

            dependantsForm.on('submit',function(event){
                event.preventDefault();
                dependants_helpers.submitDependants(dependantsSubmit, dependantsForm);
            });

            dependantsSubmit.on('click',function(event){
                event.preventDefault();
                dependants_helpers.submitDependants(dependantsSubmit, dependantsForm);
            });

            dependantsTiles.on('click',function(event){
                event.preventDefault();
                dependants_helpers.updateUserDependants($(this));
            });

            dependantsEditButtons.on('click',function(event){
                event.preventDefault();
                dependants_helpers.editDependant($(this));
            });

            dependantsDeleteButtons.on('click',function(event){
                event.preventDefault();
                dependants_helpers.deleteDependant($(this));
            });

            dependantsAddButtons.on('click',function(event){
                event.preventDefault();

                dependants_helpers.addDependant($(this));
            });

            dependantsSaveButtons.on('click',function(event){
                event.preventDefault();
                dependants_helpers.saveDependant($(this));
            });

            dependantsCancelButtons.on('click',function(event){
                event.preventDefault();
                dependants_helpers.cancelEditAddDependant($(this));
            });

            dependantCheckboxes.on('click',function(event){
                event.preventDefault();
                dependants_helpers.shareDependant($(this));
            });

            $(document).ready(function(){
                $(this).scrollTop(0);
            });

        }
    };

}).apply(app.views.personalProfile.dependants);
