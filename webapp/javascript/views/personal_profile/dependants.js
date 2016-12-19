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
                window.location.hash = 'modal-personal-profile-popup';
            }else if ( helpers.hasMultipleSelectedTiles(formData)){
                window.location.hash = 'modal-personal-profile-popup-none-apply';
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

    function updateUserDependants(selectedTile,parentContainer){
        var accountSession = personalProfile.getPersonalProfileSession(),
            formData = helpers.getTileFormData(dependantsForm);
        //enforce toggle
        _.forOwn(formData[parentContainer.attr('data-id')], function(value, key) {
            if(key !== selectedTile.attr('data-id')){
                formData[parentContainer.attr('data-id')][key] = 0;
            }
        });
        //save temporary changes
        accountSession.users.forEach(function(entry){
            entry.activeTiles.dependants = formData[entry.id];
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
            dependantsContainer = $('#container-dependants-form');
            add = $('.i--icon-add');
            dependantsDelete = $('#dependants-delete');
            dependantsContainerLine = $('#side-info-blurb3');
            dependantsContainerLine2 = $('#side-info-blurb2');
            save = $('#dependants-save');
            firstName = $('#dependants-first-name');
            lastName = $('#dependants-last-name');
            day = $('#dependants-birthday-day');
            month = $('#dependants-birthday-month');
            year = $('#dependants-birthday-year');

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
                updateUserDependants($(this),$(this).parent());
            });

            add.on('click',function(event){
                event.preventDefault();
                dependantsContainer.toggle();
            });

            dependantsDelete.on('click',function(event){
                event.preventDefault();
                dependantsContainerLine.remove();
                dependantsContainerLine2.remove();
            });

            save.on('click',function(event){
                event.preventDefault();
                $('#side-info-blurb3').append('<p>' + firstName.val() + " " + lastName.val() + '</p>');
                $('#side-info-blurb2').append('<p>' + day.val() + '/' + month.val() + '/' + year.val().slice(-2) + '</p>');
            });
        }
    };

}).apply(app.views.personalProfile.dependants);
