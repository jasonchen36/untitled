(function(){

    var $ = jQuery,
        that = app.views.personalProfile.address,
        helpers = app.helpers,
        personalProfile = app.services.personalProfile,
        ajax = app.ajax,
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
        helpers.resetForm(addressForm);
        if (addressLine1Input.val().length === 0){
            addressLine1Input.addClass(errorClass);
        }
        if (cityInput.val().length === 0){
            cityInput.addClass(errorClass);
        }
        if (postalCodeInput.val().length === 0){
            postalCodeInput.addClass(errorClass);
        }
        if(provinceInput[0].value === "") {
          postalCodeInput.addClass(errorClass);
        }
        if(residenceInput[0].value === "") {
          postalCodeInput.addClass(errorClass);
        }
        if (addressLine1SpouseInput.val().length === 0){
            addressLine1SpouseInput.addClass(errorClass);
        }
        if (citySpouseInput.val().length === 0){
            citySpouseInput.addClass(errorClass);
        }
        if (postalCodeSpouseInput.val().length === 0){
            postalCodeSpouseInput.addClass(errorClass);
        }
        if(provinceSpouseInput[0].value === "") {
          postalCodeInput.addClass(errorClass);
        }
        if(residenceSpouseInput[0].value === "") {
          postalCodeInput.addClass(errorClass);
        }
        var variable = (!helpers.formHasErrors(addressForm));
        alert (variable);
        if (!helpers.formHasErrors(addressForm)) {
            addressSubmit.addClass(disabledClass);
            ajax.ajax(
                'POST',
                '/personal-profile',
                {
                  action: 'api-pp-address',
                  data: formData
                },
                'json'
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
            addressLine1Input = $('#address-first-line');
            cityInput = $('#address-city');
            provinceInput = $('#province');
            residenceInput = $('#province2');
            postalCodeInput = $('#address-postal-code');
            addressLine1SpouseInput = $('#address-first-line-spouse');
            citySpouseInput = $('#address-city-spouse');
            provinceSpouseInput = $('#province-spouse');
            residenceSpouseInput = $('#province2-spouse');
            postalCodeSpouseInput = $('#address-postal-code-spouse');


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
