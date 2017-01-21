(function(){

    var $ = jQuery,
        that = app.views.personalProfile.address,
        helpers = app.helpers,
        personalProfile = app.services.personalProfile,
        apiService = app.apiservice,
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
        var accountInfo = helpers.getAccountInformation(sessionData);
        helpers.resetForm(addressForm);
        $('.'+helpers.formContainerClass).each(function(){
            validateAddressFormData($(this));
        });

        if (!helpers.formHasErrors(addressForm)) {
            addressSubmit.addClass(disabledClass);

            var taxReturnIds = [];
            var addressIds = [];
            Promise.resolve()
                .then(function(){
                    var promiseAddresses = [];
                    _.each(formData, function(entry, key){
                        var getAddresses = apiService.getAddresses(sessionData, key);
                        taxReturnIds.push(key);
                        promiseAddresses.push(getAddresses);
                    });
                   return Promise.all(promiseAddresses);
                })
                .then(function(response){
                    var promiseSaveAddresses = [];
                    var promiseUpdateProvinceOfResidence = [];
                    var index = 0;
                    _.each(response, function(entry){

                       if(entry.length > 0){
                            var updateAddress = apiService.updateAddress(sessionData, taxReturnIds[index], entry[0].id, formData[taxReturnIds[index]]);
                            addressIds[index] = entry[0].id;
                            promiseSaveAddresses.push(updateAddress);
                       }else{
                           var createAddress = apiService.createAddress(sessionData, taxReturnIds[index], formData[taxReturnIds[index]]);
                           promiseSaveAddresses.push(createAddress);
                       }
                        var putResidence = apiService.updateProvinceOfResidence(sessionData, taxReturnIds[index], formData[taxReturnIds[index]]);
                        promiseUpdateProvinceOfResidence.push(putResidence);


                        index++;
                    });


                  return Promise.all([Promise.all(promiseSaveAddresses),
                      Promise.all(promiseUpdateProvinceOfResidence)
                  ]);

                })
                .then(function(response){
                    var index = 0;

                    var promiseLinkAddresses = [];
                    _.each(response[0], function(entry){

                        if(typeof entry.addressId !== 'undefined'){
                            var linkAddress = apiService.linkExistingAddresses(sessionData, taxReturnIds[index], entry.addressId);
                            addressIds[index] = entry.addressId;
                            promiseLinkAddresses.push(linkAddress);
                        }
                        index++;
                    });
                    return Promise.all(promiseLinkAddresses);
                })
                .then(function(response){
                    var promiseGetReturns = [];
                    var promiseArrayCategory = [];

                    var ajaxCategory = apiService.getCategoryById(sessionData, 13);
                    promiseArrayCategory.push(ajaxCategory);
                    promiseGetReturns.push(apiService.getTaxReturns(sessionData));

                    return Promise.all([
                        Promise.all(promiseGetReturns),
                        Promise.all(promiseArrayCategory)
                    ]);
                })
                .then(function(response){
                    var data = {};
                    data.accountInfo = accountInfo;
                    data.taxReturns = response[0][0];
                    data.taxReturns.category = response[1];
                    _.each(data.taxReturns, function(entry){
                        if(entry.canadianCitizen === 1){
                            entry.citizenClass = "active";
                        }else{
                            entry.citizenClass = "";
                        }

                        if(entry.authorizeCRA === 1){
                            entry.CRAClass = "active";
                        }else{
                            entry.CRAClass = "";
                        }
                        if(entry.dateOfBirth !== null) {
                            entry.year = moment(entry.dateOfBirth).format("YYYY");
                            entry.month = moment(entry.dateOfBirth).format("MM");
                            entry.day = moment(entry.dateOfBirth).format("DD");
                        }

                    });
                    personalProfile.goToNextPage(data);
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
        if ((provinceResidence.val() === "FJ") && (helpers.isEmpty(country.val()))){
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
        if (validateAddressFormData(addressForm.find('.'+helpers.formContainerClass).first())) {
            if (!checkbox.hasClass(helpers.activeClass)) {
                //checkbox
                checkbox.addClass(helpers.activeClass);

                //populate form
                var formData = getTopFilerAddress(),
                    taxReturnId = parentContainer.attr('data-id');

                //street address
                parentContainer.find('#first-line-' + taxReturnId).val(formData.street).prop('disabled', true);
                //city
                parentContainer.find('#city-' + taxReturnId).val(formData.city).prop('disabled', true);
                //postalCode
                parentContainer.find('#postal-code-' + taxReturnId).val(formData.postalCode).prop('disabled', true);
                //province
                parentContainer.find('#province-' + taxReturnId).val(formData.province).prop('disabled', true);
                //country
                parentContainer.find('#country-' + taxReturnId).val(formData.country).prop('disabled', true);
            } else {
                //checkbox
                checkbox.removeClass(helpers.activeClass);

                //reset form for manual entry
                parentContainer.find('input').val('').prop('disabled', false);
                parentContainer.find('select').val('').prop('disabled', false);
            }
        }
    }

    function goToPreviousScreen(){
        if (!addressSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormData(addressForm),
                sessionData = personalProfile.getPersonalProfileSession(),
                accountInfo = helpers.getAccountInformation(sessionData),
                pageData = personalProfile.getPageSession(),
                previousScreenCategoryId = 9;

            if (!helpers.formHasErrors(addressForm)) {
                addressSubmit.addClass(disabledClass);
                return Promise.resolve()
                    .then(function () {
                        addressSubmit.addClass(disabledClass);
                        var taxReturnIds = [];
                        var addressIds = [];
                        Promise.resolve()
                            .then(function () {
                                var promiseAddresses = [];
                                _.each(formData, function (entry, key) {
                                    var getAddresses = apiService.getAddresses(sessionData, key);
                                    taxReturnIds.push(key);
                                    promiseAddresses.push(getAddresses);
                                });
                                return Promise.all(promiseAddresses);
                            })
                            .then(function (response) {
                                var promiseSaveAddresses = [];
                                var index = 0;
                                _.each(response, function (entry) {
                                    if (entry.length > 0) {
                                        var updateAddress = apiService.updateAddress(sessionData, taxReturnIds[index], entry[0].id, formData[taxReturnIds[index]]);
                                        addressIds[index] = entry[0].id;
                                        promiseSaveAddresses.push(updateAddress);
                                    } else {
                                        var createAddress = apiService.createAddress(sessionData, taxReturnIds[index], formData[taxReturnIds[index]]);
                                        promiseSaveAddresses.push(createAddress);
                                    }
                                    var putResidence = apiService.updateProvinceOfResidence(sessionData, taxReturnIds[index], formData[taxReturnIds[index]]);
                                    promiseSaveAddresses.push(putResidence);

                                    index++;
                                });
                                return Promise.all(promiseSaveAddresses);
                            })
                            .then(function (response) {
                                var index = 0;
                                var promiseLinkAddresses = [];
                                _.each(response, function (entry) {
                                    if (typeof entry.addressId !== 'undefined') {
                                        var linkAddress = apiService.linkExistingAddresses(sessionData, taxReturnIds[index], entry.addressId);
                                        addressIds[index] = entry.addressId;
                                        promiseLinkAddresses.push(linkAddress);
                                    }
                                    index++;
                                });
                                return Promise.all(promiseLinkAddresses);
                            });
                    })
                    .then(function () {
                        var promiseSaveAnswers = [],
                            promiseGetDependants = [],
                            promiseGetQuestions = apiService.getQuestions(sessionData, previousScreenCategoryId),
                            promiseGetAnswers = [];
                        _.each(pageData.taxReturns, function (entry) {
                            promiseGetAnswers.push(apiService.getAnswers(sessionData, entry.taxReturnId, previousScreenCategoryId));
                            promiseGetDependants.push(apiService.getDependants(sessionData, entry.taxReturnId));
                        });
                        return Promise.all([
                            Promise.all(promiseSaveAnswers),
                            Promise.all(promiseGetAnswers),
                            promiseGetQuestions,
                            apiService.getTaxReturns(sessionData),
                            Promise.all(promiseGetDependants)
                        ]);
                    })
                    .then(function (response) {
                        var data = {};
                        data.accountInfo = accountInfo;
                        data.taxReturns = response[3];
                        data.taxReturns.questions = response[2];
                        _.each(data.taxReturns, function (taxReturn, index) {
                            taxReturn.questions = response[1][index];
                            taxReturn.dependants = response[4][index];
                            _.each(taxReturn.questions.answers, function (answer) {
                                answer.answer = 0;
                                answer.class = '';
                                if (answer.text && answer.text.toLowerCase() === 'yes') {
                                    answer.answer = 1;
                                    answer.class = helpers.activeClass;
                                }
                            });
                        });
                        personalProfile.goToPreviousPage(data);
                    })
                    .catch(function (jqXHR, textStatus, errorThrown) {
                        ajax.ajaxCatch(jqXHR, textStatus, errorThrown);
                        addressSubmit.removeClass(disabledClass);
                    });
            }
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
                goToPreviousScreen();
            });

            addressIsSameCheckbox.on('click',function(event){
                event.preventDefault();
                addressIsSameAsTopFiler($(this));
            });

            $(document).ready(function(){
                $(this).scrollTop(0);
            });
        }
    };

}).apply(app.views.personalProfile.address);
