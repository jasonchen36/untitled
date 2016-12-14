(function(){

    var $ = jQuery,
        that = app.views.personalProfile.maritalStatus,
        helpers = app.helpers,
        ajax = app.ajax,
        personalProfile = app.services.personalProfile,
        maritalStatusForm,
        maritalStatusSubmit,
        maritalStatusBack,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitMaritalStatus(){
        if (!maritalStatusSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormData(maritalStatusForm);
            if(!helpers.hasSelectedTile(formData)){
                //todo, real alert
                alert('no selected option');
            }else if ( helpers.hasMultipleSelectedTiles(formData)){
                //todo, real alert
                alert('please select only one option');
            } else {
                maritalStatusSubmit.addClass(disabledClass);
                ajax.ajax(
                    'POST',
                    '/personal-profile',
                    {
                        action: 'api-pp-marital-status',
                        data: formData
                    },
                    'json'
                )
                    .then(function(response){
                        personalProfile.goToNextPage(response.data);
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                        maritalStatusSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    function updateUserMaritalStatus(selectedTile,parentContainer){
        var accountSession = personalProfile.getPersonalProfileSession(),
            formData = helpers.getTileFormData(maritalStatusForm);
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
                entry.hasDependants = formData[entry.id]['.checkbox'];//todo, find better way of linking model id
            } catch(exception){
//do nothing
            }
        });
        personalProfile.refreshPage(accountSession);
    }

    this.init = function(){
        if ($('#personal-profile-marital-status').length > 0) {

            //variables
            maritalStatusForm = $('#marital-status-form');
            maritalStatusSubmit = $('#marital-status-submit');
            maritalStatusBack = $('#marital-status-back');

            //listeners
            maritalStatusForm.on('submit',function(event){
                event.preventDefault();
                submitMaritalStatus();
            });

            maritalStatusSubmit.on('click',function(event){
                event.preventDefault();
                submitMaritalStatus();
            });

            maritalStatusBack.on('click',function(event){
                event.preventDefault();
                personalProfile.goToPreviousPage();
            });
        }
    };

}).apply(app.views.personalProfile.maritalStatus);
