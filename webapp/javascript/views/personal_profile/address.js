(function(){

    var $ = jQuery,
        that = app.views.personalProfile.address,
        helpers = app.helpers,
        personalProfile = app.services.personalProfile,
        ajax = app.ajax,
        addressForm,
        addressSubmit,
        addressBack,
        addressFirstLineErrorLabel,
        addressCityErrorLabel,
        addressPostalCodeErrorLabel,
        addressProvinceErrorLabel,
        addressResidenceErrorLabel,
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
                        postalCode: value.postalCode
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

            addressFirstLineErrorLabel = addressForm.find('#address-first-line-label-error-' + taxReturnId),
            addressCityErrorLabel = addressForm.find('#address-city-label-error-' + taxReturnId),
            addressPostalCodeErrorLabel = addressForm.find('#address-postal-code-label-error-' + taxReturnId),
            addressProvinceErrorLabel = addressForm.find('#address-province-label-error-' + taxReturnId),
            addressResidenceErrorLabel = addressForm.find('#address-residence-label-error-' + taxReturnId);

        streetAddress.removeClass(helpers.errorClass);
        city.removeClass(helpers.errorClass);
        postalCode.removeClass(helpers.errorClass);
        province.removeClass(helpers.errorClass);
        provinceResidence.removeClass(helpers.errorClass);

        addressFirstLineErrorLabel.removeClass(helpers.errorClass);
        addressCityErrorLabel.removeClass(helpers.errorClass);
        addressPostalCodeErrorLabel.removeClass(helpers.errorClass);
        addressProvinceErrorLabel.removeClass(helpers.errorClass);
        addressResidenceErrorLabel.removeClass(helpers.errorClass);

        //street address
        if (helpers.isEmpty(streetAddress.val())){
            streetAddress.addClass(helpers.errorClass);
            addressFirstLineErrorLabel.addClass(helpers.errorClass);
            errors++;
        }
        //city
        if (helpers.isEmpty(city.val())){
            city.addClass(helpers.errorClass);
            addressCityErrorLabel.addClass(helpers.errorClass);
            errors++;
        }
        //province
        if (helpers.isEmpty(province.val())){
            province.addClass(helpers.errorClass);
            addressProvinceErrorLabel.addClass(helpers.errorClass);
            errors++;
        }
        //postal code
        if (helpers.isEmpty(postalCode.val()) || !helpers.isValidPostalCode(postalCode.val())){
            postalCode.addClass(helpers.errorClass);
            addressPostalCodeErrorLabel.addClass(helpers.errorClass);
            errors++;
        }
        //province residence
        if (helpers.isEmpty(provinceResidence.val())){
            provinceResidence.addClass(helpers.errorClass);
            addressResidenceErrorLabel.addClass(helpers.errorClass);
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
