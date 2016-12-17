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

    function checkPostal(postal) {
    var regex = new RegExp(/^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i);
    if (regex.test(postal.value))
        return true;
    else
        return false;
    }

    function submitAddress(){
        var formData = helpers.getFormData(addressForm);
        helpers.resetForm(addressForm);
        if (helpers.isEmpty(addressLine1Input.val().trim())){
            addressLine1Input.addClass(errorClass);
            alert("Pleae enter the street address correctly");
        }
        if (helpers.isEmpty(cityInput.val().trim())){
            cityInput.addClass(errorClass);
            alert("Pleae enter the city correctly");
        }
        if (helpers.isEmpty(postalCodeInput.val().trim()) || checkPostal(postalCodeInput.val())){
            postalCodeInput.addClass(errorClass);
            alert("Pleae enter the postal code correctly");
        }
        if(helpers.isEmpty(provinceInput[0].value.trim())) {
          postalCodeInput.addClass(errorClass);
          alert("Pleae enter the province correctly");
        }
        if(helpers.isEmpty(residenceInput[0].value.trim())) {
          postalCodeInput.addClass(errorClass);
          alert("Pleae enter the province of residence correctly");
        }
        if (helpers.isEmpty(addressLine1SpouseInput.val().trim())){
            addressLine1SpouseInput.addClass(errorClass);
            alert("Pleae enter the spousal street address correctly");
        }
        if (helpers.isEmpty(citySpouseInput.val().trim())){
            citySpouseInput.addClass(errorClass);
            alert("Pleae enter the spousal city correctly");
        }
        if (helpers.isEmpty(postalCodeSpouseInput.val().trim())|| checkPostal(postalCodeSpouseInput.val())){
            postalCodeSpouseInput.addClass(errorClass);
            alert("Pleae enter the spousal postal code correctly");
        }
        if(helpers.isEmpty(provinceSpouseInput[0].value.trim())) {
          postalCodeInput.addClass(errorClass);
          alert("Pleae enter the spousal province correctly");
        }
        if(helpers.isEmpty(residenceSpouseInput[0].value.trim())) {
          postalCodeInput.addClass(errorClass);
          alert("Pleae enter the spousal province of residence correctly");
        }
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
            addressLine1Input = $('#address-first-line');
            cityInput = $('#address-city');
            provinceInput = $('#mailing-province');
            residenceInput = $('#residential-province');
            postalCodeInput = $('#address-postal-code');
            addressLine1SpouseInput = $('#address-first-line-spouse');
            citySpouseInput = $('#address-city-spouse');
            provinceSpouseInput = $('#spousal-mailing-province');
            residenceSpouseInput = $('#spousal-residential-province');
            postalCodeSpouseInput = $('#address-postal-code-spouse');
            checkbox = $('.checkbox');

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

            checkbox.on('click',function(event){
                event.preventDefault();
                $(this).toggleClass(helpers.activeClass);
                addressLine1SpouseInput.val(addressLine1Input.val());
                citySpouseInput.val(cityInput.val());
                postalCodeSpouseInput.val(postalCodeInput.val());
                provinceSpouseInput[0].value = provinceInput[0].value;
            });
        }
    };

}).apply(app.views.personalProfile.address);
