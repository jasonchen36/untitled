(function(){

    var $ = jQuery,
        that = app.views.taxProfile.filingFor,
        helpers = app.helpers,
        ajax = app.ajax,
        taxProfile = app.services.taxProfile,
        filingForForm,
        filingForSubmit,
        filingForBack,
        errorClass = helpers.errorClass,
        disabledClass = helpers.disabledClass;

    function submitFilingFor(){
        if (!filingForSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormData(filingForForm);
            if(!helpers.hasSelectedTile(formData)){
                window.location.hash = 'modal-personal-profile-popup';
            }else {
                filingForSubmit.addClass(disabledClass);
                ajax.ajax(
                    'POST',
                    '/tax-profile',
                    {
                        action: 'api-tp-filing-for',
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
                        filingForSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    this.init = function(){
        if ($('#tax-profile-filing-for').length > 0) {
            //variables
            filingForForm = $('#filing-for-form');
            filingForSubmit = $('#filing-for-submit');
            filingForBack = $('#filing-for-back');

            //listeners
            filingForSubmit.on('click',function(event){
                event.preventDefault();
                submitFilingFor();
            });

            filingForForm.on('submit',function(event){
                event.preventDefault();
                submitFilingFor();
            });

            filingForBack.on('click',function(event){
                event.preventDefault();
                taxProfile.goToPreviousPage();
            });

            $(document).ready(function(){
                $(this).scrollTop(0);
            });
        }
    };

}).apply(app.views.taxProfile.filingFor);
