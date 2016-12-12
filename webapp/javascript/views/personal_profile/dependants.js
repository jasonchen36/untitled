(function(){

    var $ = jQuery,
        that = app.views.personalProfile.dependants,
        helpers = app.helpers,
        personalProfile = app.services.personalProfile,
        dependantsForm,
        dependantsSubmit,
        dependantsBack,
        dependantsSave,
        dependantsEdit,
        dependantsDelete,
        tileOptions,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitDependants(){
        if (!dependantsSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormData(dependantsForm);
            if(!helpers.hasSelectedTile(formData)){
                //todo, real alert
                alert('no selected option');
            }else if ( helpers.hasMultipleSelectedTiles(formData)){
                //todo, real alert
                alert('please select only one option');
            } else {
                dependantsSubmit.addClass(disabledClass);
                app.ajax.ajax(
                    'POST',
                    '/personal-profile',
                    {
                        action: 'api-pp-dependants',
                        data: formData
                    },
                    'json'
                )
                    .then(function(response){
                        personalProfile.goToNextPage(response.data);
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        console.log(jqXHR,textStatus,errorThrown);
                        dependantsSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    function updateUserDependants(){
        var accountSession = personalProfile.getPersonalProfileSession(),
            formData = helpers.getTileFormData(dependantsForm);
        //save temporary changes
        accountSession.users.forEach(function(entry){
            try {
                //if "yes" is selected
                entry.hasDependants = formData[entry.id][9201];//todo, find better way of linking model id
            } catch(exception){
//do nothing
            }
        });
        personalProfile.refreshPage(accountSession);
    }

    this.init = function(){
        if ($('#personal-profile-dependants').length > 0) {

            //variables
            dependantsForm = $('#dependants-form');
            dependantsSubmit = $('#dependants-submit');
            dependantsBack = $('#dependants-back');
            dependantsSave = $('#dependants-save');
            dependantsEdit = $('#dependants-edit');
            dependantsDelete = $('#dependants-delete');
            tileOptions = $('.taxplan-tile');

            //overwrite standard tile selector active toggle
            $(document).off('click', '.'+helpers.tileClass);

            //listeners
            dependantsForm.on('submit',function(event){
                event.preventDefault();
                submitDependants();
            });

            dependantsSubmit.on('click',function(event){
                event.preventDefault();
                submitDependants();
            });

            dependantsSave.on('click',function(event){
                event.preventDefault();
                //TODO: Save dependant function
            });

            dependantsEdit.on('click',function(event){
                event.preventDefault();
                //TODO: Edit dependant function
            });

            dependantsDelete.on('click',function(event){
                event.preventDefault();
                //TODO: Delete dependant function
            });

            dependantsBack.on('click',function(event){
                event.preventDefault();
                personalProfile.goToPreviousPage();
            });

            tileOptions.on('click',function(event){
                event.preventDefault();
                $(this).toggleClass(helpers.activeClass);
                updateUserDependants();
            });
        }
    };

}).apply(app.views.personalProfile.dependants);