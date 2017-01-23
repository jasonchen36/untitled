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
        filersNamesDeleteFiler,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitFilersNames(){
        if (!filersNamesSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormData(filersNamesForm);
            var taxProfileId, hasErrors;
            hasErrors = false;
            helpers.resetForm(filersNamesForm);

            var accountSess = taxProfile.getAccountSession();
            accountSess.users.forEach(function(entry){
                taxProfileId = entry.id;
                var filerName = $('#filers-names-' + taxProfileId);
                var filerNameErrorLabel = $('#filers-names-error-name-' + taxProfileId);

                filerNameErrorLabel.removeClass(helpers.errorClass);

                if(helpers.isEmpty(filerName.val()) && taxProfileId !== undefined){
                    filerName.addClass(helpers.errorClass);
                    filerNameErrorLabel.addClass(helpers.errorClass);
                    hasErrors = true;
                }
            });

            if(!hasErrors){
                filersNamesSubmit.addClass(disabledClass);
                ajax.ajax(
                    'POST',
                    '/tax-profile',
                    {
                        action: 'api-tp-filers-names',
                        data: formData
                    },
                    'json',
                    { }
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
        var accountSession = taxProfile.getAccountSession(),
            formData = helpers.getFormData(filersNamesForm),
            userId = accountSession.users[0].id+'-other-'+(accountSession.users.length-1);
        //save temporary changes
        accountSession.users.forEach(function(entry){
            entry.firstName = formData[entry.id];
        });
        //add new filer to the array
        if(!_.find(accountSession.users, ['id', userId])){
            accountSession.users.push({
                id: userId
            });
        }
        taxProfile.refreshPage(accountSession);
    }

    function deleteFiler(indexToDelete){
        var accountSession = taxProfile.getAccountSession(),
            formData = helpers.getFormData(filersNamesForm);
        //save temporary changes
        accountSession.users.forEach(function(entry){
            if (formData.hasOwnProperty(entry.id)){
                entry.firstName = formData[entry.id];
            }
        });
        //remove filer to the array
        accountSession.users.splice(indexToDelete+2, 1);
        taxProfile.refreshPage(accountSession);
    }

    this.init = function(){
        if ($('#tax-profile-filers-names').length > 0) {

            //variables
            filersNamesForm = $('#filers-names-form');
            filersNamesSubmit = $('#filers-names-submit');
            filersNamesBack = $('#filers-names-back');
            filersNamesNewFiler = $('#filers-names-new-filer');
            filersNamesDeleteFiler = $('.filers-names-delete-filer');
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

            filersNamesDeleteFiler.on('click', function (event) {
                event.preventDefault();
                deleteFiler(parseInt($(this).attr('data-index')));
            });

            $(document).ready(function(){
                $(this).scrollTop(0);
            });
        }
    };

}).apply(app.views.taxProfile.filersNames);