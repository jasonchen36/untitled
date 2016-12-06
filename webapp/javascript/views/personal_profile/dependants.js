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
        if (!dependantsSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormData(dependantsForm);
            if(!helpers.hasSelectedTile(formData)){
                //todo, real alert
                alert('no selected option');
            } else {
                // todo, keep choice clicked on previous?
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