(function(){

    var $ = jQuery,
        that = app.views.taxProfile.filersNames,
        helpers = app.helpers,
        taxProfile = app.services.taxProfile,
        ajax = app.ajax,
        filersNamesForm,
        filersNamesSubmit,
        filersNamesBack,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitFilersNames(){
        if (!filersNamesSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormData(filersNamesForm);
            if(false){
                //todo, real validation & alert
                alert('no selected option');
            } else {
                filersNamesSubmit.addClass(disabledClass);
                ajax.ajax(
                    'POST',
                    '/tax-profile',
                    {
                        action: 'api-tp-filers-names',
                        data: formData
                    },
                    'json'
                )
                    .then(function(response){
                        taxProfile.goToNextPage(response.data);
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                        filersNamesSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    this.init = function(){
        if ($('#tax-profile-filers-names').length > 0) {

            //variables
            filersNamesForm = $('#filers-names-form');
            filersNamesSubmit = $('#filers-names-submit');
            filersNamesBack = $('#filers-names-back');

            //listeners
            filersNamesForm.on('submit',function(event){
                event.preventDefault();
                submitFilersNames();
            });

            filersNamesSubmit.on('click',function(event){
                event.preventDefault();
                submitFilersNames();
            });

            filersNamesBack.on('click',function(event){
                event.preventDefault();
                taxProfile.goToPreviousPage();
            });
        }
    };

}).apply(app.views.taxProfile.filersNames);