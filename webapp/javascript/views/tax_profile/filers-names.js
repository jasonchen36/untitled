(function(){

    var $ = jQuery,
        that = app.views.taxProfile.filersNames,
        helpers = app.helpers,
        taxProfile = app.services.taxProfile,
        ajax = app.ajax,
        filersNamesForm,
        filersNamesSubmit,
        filersNamesBack,
        filersNamesNewFiler,
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
    
    function addFiler(){
        var accountSession = taxProfile.getAccountSession();
        accountSession.users.push({
            id: accountSession.users[0].id+'-other-'+(accountSession.users.length-1)
        });
        taxProfile.refreshPage(accountSession);
    }
    
    function deleteFiler(){
        
    }

    this.init = function(){
        if ($('#tax-profile-filers-names').length > 0) {

            //variables
            filersNamesForm = $('#filers-names-form');
            filersNamesSubmit = $('#filers-names-submit');
            filersNamesBack = $('#filers-names-back');
            filersNamesNewFiler = $('#filers-names-new-filer');

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

            filersNamesNewFiler.on('click',function(event){
                event.preventDefault();
                addFiler();
            });
        }
    };

}).apply(app.views.taxProfile.filersNames);