(function(){

    var $ = jQuery,
        that = app.views.personalProfile.address,
        helpers = app.helpers,
        personalProfile = app.services.personalProfile,
        ajax = app.ajax,
        addressForm,
        addressSubmit,
        addressBack,
        addressIsSameCheckbox,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitAddress(){
        var formData = helpers.getFormData(addressForm);
        helpers.resetForm(addressForm);

        if (!helpers.formHasErrors(addressForm)) {
            addressSubmit.addClass(disabledClass);
            ajax.ajax(
                'POST',
                '/personal-profile',
                {
                    action: 'api-pp-address',
                    data: formData
                },
                'json',
                { }
            )
                .then(function(response){
                    personalProfile.goToNextPage(response.data);
                })
                .catch(function(jqXHR,textStatus,errorThrown){
                    ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                    addressSubmit.removeClass(disabledClass);
                });
        }
    }

    this.init = function(){
        if ($('#personal-profile-address').length > 0) {

            //variables
            addressForm = $('#address-form');
            addressSubmit = $('#address-submit');
            addressBack = $('#address-back');
            addressIsSameCheckbox = $('.checkbox-container');

            console.log(helpers.getFormData(addressForm));
            
            //listeners
            addressForm.on('submit',function(event){
                event.preventDefault();
                submitAddress();
            });

            addressSubmit.on('click',function(event){
                event.preventDefault();
                submitAddress();
            });

            addressBack.on('click',function(event){
                event.preventDefault();
                personalProfile.goToPreviousPage();
            });

            addressIsSameCheckbox.on('click',function(event){
                event.preventDefault();
                $(this).find('.checkbox').toggleClass(helpers.activeClass);
                console.log('todo');
                //todo, logic and add disabled
            });
        }
    };

}).apply(app.views.personalProfile.address);
