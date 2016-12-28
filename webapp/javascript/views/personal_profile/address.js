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
        errorClass = helpers.errorClass,
        disabledClass = helpers.disabledClass;

    function submitAddress(){
        var sessionData = personalProfile.getPersonalProfileSession(),
            formData = helpers.getFormData(addressForm);
        helpers.resetForm(addressForm);
        $('.'+helpers.formContainerClass).each(function(){
            validateAddressFormData($(this));
        });
        if (!helpers.formHasErrors(addressForm)) {
            addressSubmit.addClass(disabledClass);
            var body,
                taxReturnData,
                addressRequests = _.map(formData, function(value, key) {
                    body = {
                        addressLine1:  value.street,
                        addressLine2: '',
                        city: value.city,
                        province: value.province,
                        postalCode: value.postalCode,
                        country: value.country
                    };
                    //todo, resolve if the address is new or needs to be updated (different api call)
                    return ajax.ajax(
                        'POST',
                        sessionData.apiUrl+'/tax_return/'+key+'/address',
                        body,
                        'json',
                        {}
                    );
                }),
                taxReturnRequests = _.map(formData, function(formValue, formKey) {
                    taxReturnData = _.find(sessionData.taxReturns, function(entry){
                        return parseInt(formKey) === entry.taxReturnId;
                    });
                    body = {
                        accountId:  taxReturnData.accountId,
                        productId:  taxReturnData.productId,
                        firstName: taxReturnData.firstName,
                        lastName: taxReturnData.lastName,
                        provinceOfResidence: formValue.provinceResidence,
                        dateOfBirth: taxReturnData.dateOfBirth,
                        canadianCitizen: taxReturnData.canadianCitizen,
                        authorizeCra: taxReturnData.authorizeCRA
                    };
                    return ajax.ajax(
                        'PUT',
                        sessionData.apiUrl+'/tax_return/'+formKey,
                        body,
                        'json',
                        {}
                    );
                });
            Promise.all(addressRequests)
                .then(function(response){
                    var addressAssociationRequests = _.map(response, function(value, key) {
                        return ajax.ajax(
                            'POST',
                            sessionData.apiUrl+'/tax_return/'+taxReturnData.taxReturnId+'/address/'+value.addressId,
                            body,
                            '',
                            {}
                        );
                    });
                    return Promise.all(addressAssociationRequests);
                })
                .then(function(){
                    return Promise.all(taxReturnRequests)
                        .then(function(){
                            //todo, get updated profile data?
                            personalProfile.goToNextPage();
                        });
                })
                .catch(function(jqXHR,textStatus,errorThrown){
                    ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                    addressSubmit.removeClass(disabledClass);
                });
        }
    }

    function getTopFilerAddress(){
        var sessionData = personalProfile.getPersonalProfileSession();
        return _.find(helpers.getFormData(addressForm), function(value, key){
            return parseInt(key) === sessionData.taxReturns[0].taxReturnId;
        });
    }

    function validateAddressFormData(addressForm){
        var errors = 0,
            taxReturnId = addressForm.attr('data-id'),
            streetAddress = addressForm.find('#first-line-'+taxReturnId),
            city = addressForm.find('#city-'+taxReturnId),
            postalCode = addressForm.find('#postal-code-'+taxReturnId),
            province = addressForm.find('#province-'+taxReturnId),
            provinceResidence = addressForm.find('#province-residence-'+taxReturnId),
            country = addressForm.find('#country-'+taxReturnId),

            addressFirstLineErrorLabel = addressForm.find('#address-first-line-label-error-' + taxReturnId),
            addressCityErrorLabel = addressForm.find('#address-city-label-error-' + taxReturnId),
            addressPostalCodeErrorLabel = addressForm.find('#address-postal-code-label-error-' + taxReturnId),
            addressProvinceErrorLabel = addressForm.find('#address-province-label-error-' + taxReturnId),
            addressResidenceErrorLabel = addressForm.find('#address-residence-label-error-' + taxReturnId),
            addressCountryErrorLabel = addressForm.find('#country-label-error-' + taxReturnId);


        streetAddress.removeClass(errorClass);
        city.removeClass(errorClass);
        postalCode.removeClass(errorClass);
        province.removeClass(errorClass);
        provinceResidence.removeClass(errorClass);
        country.removeClass(errorClass);
        
        addressFirstLineErrorLabel.removeClass(errorClass);
        addressCityErrorLabel.removeClass(errorClass);
        addressPostalCodeErrorLabel.removeClass(errorClass);
        addressProvinceErrorLabel.removeClass(errorClass);
        addressResidenceErrorLabel.removeClass(errorClass);
        addressCountryErrorLabel.removeClass(errorClass);

        //street address
        if (helpers.isEmpty(streetAddress.val())){
            streetAddress.addClass(errorClass);
            addressFirstLineErrorLabel.addClass(errorClass);
            errors++;
        }
        //city
        if (helpers.isEmpty(city.val())){
            city.addClass(errorClass);
            addressCityErrorLabel.addClass(errorClass);
            errors++;
        }
        //province
        if (helpers.isEmpty(province.val())){
            province.addClass(errorClass);
            addressProvinceErrorLabel.addClass(errorClass);
            errors++;
        }
        //postal code
        if (helpers.isEmpty(postalCode.val()) || !helpers.isValidPostalCode(postalCode.val())){
            postalCode.addClass(errorClass);
            addressPostalCodeErrorLabel.addClass(errorClass);
            errors++;
        }
        //province residence
        if (helpers.isEmpty(provinceResidence.val())){
            provinceResidence.addClass(errorClass);
            addressResidenceErrorLabel.addClass(errorClass);
            errors++;
        }
        //country
        if (helpers.isEmpty(country.val())){
            country.addClass(errorClass);
            addressCountryErrorLabel.addClass(errorClass);
            errors++;
        }
        return errors < 1;
    }

    function addressIsSameAsTopFiler(element){
        //checkbox toggle
        var checkbox = element.find('.checkbox').first(),
            parentContainer = element.parent();
        if (validateAddressFormData(addressForm.find('.'+helpers.formContainerClass).first()) && !checkbox.hasClass(helpers.activeClass)) {
            //checkbox
            checkbox.addClass(helpers.activeClass);

            //populate form
            var formData = getTopFilerAddress(),
                taxReturnId = parentContainer.attr('data-id');
            //street address
            parentContainer.find('#first-line-'+taxReturnId).val(formData.street).prop('disabled', true);
            //city
            parentContainer.find('#city-'+taxReturnId).val(formData.city).prop('disabled', true);
            //postalCode
            parentContainer.find('#postal-code-'+taxReturnId).val(formData.postalCode).prop('disabled', true);
            //province
            parentContainer.find('#province-'+taxReturnId).val(formData.province).prop('disabled', true);
            //country
            parentContainer.find('#country-'+taxReturnId).val(formData.country).prop('disabled', true);
        } else {
            //checkbox
            checkbox.removeClass(helpers.activeClass);

            //reset form for manual entry
            parentContainer.find('input').val('').prop('disabled', false);
            parentContainer.find('select').val('').prop('disabled', false);
        }
    }

    this.init = function(){
        if ($('#personal-profile-address').length > 0) {

            //variables
            addressForm = $('#address-form');
            addressSubmit = $('#address-submit');
            addressBack = $('#address-back');
            addressIsSameCheckbox = $('.checkbox-container');

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
                addressIsSameAsTopFiler($(this));
            });
        }
    };

}).apply(app.views.personalProfile.address);
