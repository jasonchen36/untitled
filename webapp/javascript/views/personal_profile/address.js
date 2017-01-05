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
        helpers.resetForm(addressForm);
        $('.'+helpers.formContainerClass).each(function(){
            validateAddressFormData($(this));
        });
        if (!helpers.formHasErrors(addressForm)) {
            addressSubmit.addClass(disabledClass);
            return Promise.resolve()
            .then(function(){
            var body,
                taxReturnData,
                promiseArrayQuestions = [],
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
                dateOfBirthRequests = _.map(formData, function(value, key) {
                var uri = sessionData.apiUrl+ '/tax_return/' + key,
                accountInfo = helpers.getAccountInformation(sessionData);
                var promiseAnswers = ajax.ajax(
                    'GET',
                    uri,
                    {
                    },
                    'json',
                   {
                          'Authorization': 'Bearer '+ accountInfo.token
                   }
                );
                promiseArrayQuestions.push(promiseAnswers);
              }),
                taxReturnRequests = _.map(formData, function(formValue, formKey) {
                    taxReturnData = _.find(sessionData.taxReturns, function(entry){
                        return parseInt(formKey) === entry.taxReturnId;
                    });
                    body = {
                        provinceOfResidence: formValue.provinceResidence
                    };
                    return ajax.ajax(
                        'PUT',
                        sessionData.apiUrl+'/tax_return/'+formKey,
                        body,
                        'json',
                        {}
                    );
                }),
                addressAssociationRequests = _.map(formData, function(value, key) {
                    return ajax.ajax(
                        'POST',
                        sessionData.apiUrl+'/tax_return/'+taxReturnData.taxReturnId+'/address/'+value.addressId,
                        body,
                        '',
                        {}
                    );
                });

            return Promise.all([Promise.all(promiseArrayQuestions),Promise.all(addressRequests),Promise.all(addressAssociationRequests)]);
          })
                .then(function(response){
                   console.log("what is the response", response);
                   var taxReturn = response[0];
                   console.log("this is the tax return", taxReturn);
                   var accountInfo = helpers.getAccountInformation(sessionData);
                       taxReturn.accountInfo = accountInfo;
                       var answerIndex = 0;
                       _.each(taxReturn, function(answer){
                         console.log("this is the answer", answer);

                        console.log("this is the dob", answer.date_of_birth);

                        //  console.log("this is the promise value", answer.[[PromiseValue]);
                          //  if(answerIndex === 0) {
                          //      answer.tiles = apiService.getMarriageTiles(taxReturn.taxReturnId, answer.text);
                          //      answer.answer = 0;
                          //      answer.class = "";
                          //      if (!answer.text) {
                          //          answer.answer = 0;
                          //          answer.class = "";
                          //      } else if (answer.text === "Yes") {
                          //          answer.answer = 1;
                          //          answer.class = helpers.activeClass;
                          //      }
                          //  }else if(answerIndex === 1){
                          //      answer.answer = 0;
                          //      answer.class = "";
                          //      if(answer.text === "Yes"){
                          //          answer.answer = 1;
                          //          answer.class = helpers.activeClass;
                          //      }
                          //  }else{
                          //      answer.day = "";
                          //      answer.month= "";
                          //      if(answer.text.length === 10){
                          //          answer.day = answer.text.substring(8, 10);
                          //          answer.month = answer.text.substring(5,7);
                          //      }
                          //  }
                          //  answerIndex++;
                       });
                })
                .then(function(){
                    return Promise.all(taxReturnRequests)
                        .then(function(){
                            console.log("what is the taxReturnRequests", taxReturnRequests[2]);
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

    function goToPreviousScreen(){
        if (!addressSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormData(addressForm),
                sessionData = personalProfile.getPersonalProfileSession(),
                accountInfo = helpers.getAccountInformation(sessionData),
                pageData = personalProfile.getPageSession(),
                previousScreenCategoryId = 9;
            addressSubmit.addClass(disabledClass);
            return Promise.resolve()
                .then(function() {
                    //todo, save answers
                    var promiseSaveAnswers = [],
                        promiseGetDependants = [],
                        promiseGetQuestions = apiService.getQuestions(sessionData,previousScreenCategoryId),
                        promiseGetAnswers = [];
                    _.each(pageData.taxReturns, function(entry) {
                        promiseGetAnswers.push(apiService.getAnswers(sessionData,entry.taxReturnId,previousScreenCategoryId));
                        promiseGetDependants.push(apiService.getDependants(sessionData,entry.taxReturnId));
                    });
                    return Promise.all([
                        Promise.all(promiseSaveAnswers),
                        Promise.all(promiseGetAnswers),
                        promiseGetQuestions,
                        apiService.getTaxReturns(sessionData),
                        Promise.all(promiseGetDependants)
                    ]);
                })
                .then(function(response) {
                    var data = {};
                    data.accountInfo = accountInfo;
                    data.taxReturns = response[3];
                    data.taxReturns.questions = response[2];
                    _.each(data.taxReturns, function(taxReturn, index){
                        taxReturn.questions = response[1][index];
                        taxReturn.dependants = response[4][index];
                        _.each(taxReturn.questions.answers, function(answer){
                            answer.answer = 0;
                            answer.class = '';
                            if (answer.text && answer.text.toLowerCase() === 'yes'){
                                answer.answer = 1;
                                answer.class = helpers.activeClass;
                            }
                        });
                    });
                    personalProfile.goToPreviousPage(data);
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
        }
    };

}).apply(app.views.personalProfile.address);
