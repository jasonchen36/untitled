(function(){

    var $ = jQuery,
        that = app.views.personalProfile.address,
        helpers = app.helpers,
        personalProfile = app.services.personalProfile,
        addressForm,
        addressSubmit,
        addressBack,
        addressLine1Input,
        cityInput,
        postalCodeInput,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitAddress(){
        var formData = helpers.getFormData(addressForm);
        if (helpers.isEmpty(formData.addressLine1)){
            addressLine1Input.addClass(addressLine1Input);
        }
        if (helpers.isEmpty(formData.city)){
            cityInput.addClass(errorClass);
        }
        if (helpers.isEmpty(formData.postalCode)){
            postalCodeInput.addClass(errorClass);
        }
        if (!helpers.formHasErrors(addressForm)) {
            addressSubmit.addClass(disabledClass);
            ajax.ajax(
                'POST',
                '/personal-profile',
                {
                    action: 'api-tp-address',
                    addressLine1: formData.addressLine1,
                    Province: formData.province,
                    City: formData.city,
                    postalCode: formData.postalCode
                },
                'json'
            )
                .then(function(response){
                    taxProfile.goToNextPage(response.data);
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
            addressLine1Input = $('#address-first-line');
            cityInput = $('#address-city');
            postalCodeInput = $('#address-postal-code');


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
        }
    };

}).apply(app.views.personalProfile.address);
