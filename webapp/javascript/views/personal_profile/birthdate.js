(function(){

    var $ = jQuery,
        that = app.views.personalProfile.birthdate,
        helpers = app.helpers,
        personalProfile = app.services.personalProfile,
        birthdateForm,
        ajax = app.ajax,
        apiService = app.apiservice,
        birthdateSubmit,
        birthdateBack,
        birthdateDayLabelError,
        birthdateMonthLabelError,
        birthdateYearLabelError,
        dayInput,
        monthInput,
        yearInput,
        checkboxes,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitBirthdate(){
        var sessionData = personalProfile.getPersonalProfileSession();
        var accountInfo = helpers.getAccountInformation(sessionData);
        var formData = helpers.getFormData(birthdateForm);
        helpers.resetForm(birthdateForm);
        $('.'+helpers.formContainerClass).each(function(){
            validateBirthdateFormData($(this));
        });
        if (!helpers.formHasErrors(birthdateForm)) {
            birthdateSubmit.addClass(disabledClass);
            var body,
                taxReturnData,
                birthdateRequests = _.map(formData, function(entry, key) {
                  var entireYear = 0;
                    if (entry.birthdate_year > 17){
                        entireYear = "19" + entry.birthdate_year;
                      } else {
                        entireYear = "20" + entry.birthdate_year;
                      }
                    // TODO, put this into an apiservice call
                    body = {
                        accountId: accountInfo.accountId,
                        productId: accountInfo.productId,
                        dateOfBirth: entireYear + "-" + entry.birthdate_month + "-" + entry.birthdate_day,
                        canadianCitizen: entry.canadian_citizen.toString(),
                        authorizeCra: entry.CRA_authorized.toString()
                    };
            return ajax.ajax(
                'PUT',
                sessionData.apiUrl+'/tax_return/'+key,
                body,
                'json',
                {
                  'Authorization': 'Bearer '+ accountInfo.token
                }
            );
          });
          Promise.all(birthdateRequests)
                .then(function(response){
                    window.location.href = '/dashboard';
                })
                .catch(function(jqXHR,textStatus,errorThrown){
                    ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                    birthdateSubmit.removeClass(disabledClass);
                });
        }
    }

    function goToPreviousScreen(){
        var formData = helpers.getFormData(birthdateForm);
        var sessionData = personalProfile.getPersonalProfileSession();
        var accountInfo = helpers.getAccountInformation(sessionData);

        birthdateSubmit.addClass(disabledClass);
        return Promise.resolve()
            .then(function() {
                var promiseSaveAnswers = [];
                var promiseGetAnswers = [];
                var promiseGetQuestions = [];

                helpers.resetForm(birthdateForm);
                $('.'+helpers.formContainerClass).each(function(){
                    validateBirthdateFormData($(this));
                });

                if (!helpers.formHasNonCheckboxErrors(birthdateForm)) {
                    var body;
                    _.each(formData, function(entry, key) {
                        var entireYear = 0;
                        if (entry.birthdate_year > 17){
                            entireYear = "19" + entry.birthdate_year;
                        } else {
                            entireYear = "20" + entry.birthdate_year;
                        }
                        // TODO, put this into an apiservice call
                        body = {
                            accountId: accountInfo.accountId,
                            productId: accountInfo.productId,
                            dateOfBirth: entireYear + "-" + entry.birthdate_month + "-" + entry.birthdate_day,
                            canadianCitizen: entry.canadian_citizen.toString(),
                            authorizeCra: entry.CRA_authorized.toString()
                        };
                        var putBirthdate = ajax.ajax(
                            'PUT',
                            sessionData.apiUrl+'/tax_return/'+key,
                            body,
                            'json',
                            {
                                'Authorization': 'Bearer '+ accountInfo.token
                            }
                        );
                        promiseSaveAnswers.push(putBirthdate);
                    });
                }

                var ajaxQuestions = apiService.getQuestions(sessionData,2);
                promiseGetQuestions.push(ajaxQuestions);

                _.each(formData, function (entry, key) {
                    promiseGetAnswers.push(apiService.getAddresses(sessionData, key));
                });

                return Promise.all([
                    Promise.all(promiseSaveAnswers),
                    Promise.all(promiseGetAnswers),
                    promiseGetQuestions,
                    apiService.getTaxReturns(sessionData)]);
            })
            .then(function(response) {
                var data = {};
                data.accountInfo = accountInfo;
                data.taxReturns = response[3];
                data.taxReturns.questions = response[2];
                _.each(data.taxReturns, function (taxReturn, index) {
                    taxReturn.address = response[1][index][0];
                });
                personalProfile.goToPreviousPage(data);
            })
            .catch(function(jqXHR,textStatus,errorThrown){
                ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                birthdateSubmit.removeClass(disabledClass);
            });
    }

    function toggleCheckboxActiveState(element){
        element.find('.checkbox').first().toggleClass(helpers.activeClass);
    }

    function validateBirthdateFormData(birthdateForm){
      var errors = 0;
      taxReturnId = birthdateForm.attr('data-id');
      dayInput = $('#dependants-birthday-day-'+taxReturnId);
      monthInput = $('#dependants-birthday-month-'+taxReturnId);
      yearInput = $('#dependants-birthday-year-'+taxReturnId);
      var canadianCitizen = $('#canadian-citizen-'+taxReturnId);
      var CRAAuthorized = $('#CRA-authorized-'+taxReturnId);

      birthdateDayLabelError = $('#birthdate-day-label-error-'+taxReturnId);
      birthdateMonthLabelError = $('#birthdate-month-label-error-'+taxReturnId);
      birthdateYearLabelError = $('#birthdate-year-label-error-'+taxReturnId);

      dayInput.removeClass(errorClass);
      monthInput.removeClass(errorClass);
      yearInput.removeClass(errorClass);
      canadianCitizen.removeClass(errorClass);
      CRAAuthorized.removeClass(errorClass);

      birthdateDayLabelError.removeClass(errorClass);
      birthdateMonthLabelError.removeClass(errorClass);
      birthdateYearLabelError.removeClass(errorClass);

      if (!helpers.isValidDay(dayInput.val())){
          dayInput.addClass(errorClass);
          birthdateDayLabelError.addClass(errorClass);
          errors++;
      }
      if (!helpers.isValidMonth(monthInput.val())){
          monthInput.addClass(errorClass);
          birthdateMonthLabelError.addClass(errorClass);
          errors++;
      }
      if (!helpers.isValidYear(yearInput.val())){
          yearInput.addClass(errorClass);
          birthdateYearLabelError.addClass(errorClass);
          errors++;
      }
      if (!canadianCitizen.hasClass(helpers.activeClass)){
          canadianCitizen.addClass(errorClass);
          errors++;
      }
       if (!CRAAuthorized.hasClass(helpers.activeClass)){
          CRAAuthorized.addClass(errorClass);
          errors++;
      }
      return errors < 1;
    }

    this.init = function(){
        if ($('#personal-profile-birthdate').length > 0) {

            //variables
            birthdateForm = $('#birthdate-form');
            birthdateSubmit = $('#birthdate-submit');
            birthdateBack = $('#birthdate-back');
            checkboxes = $('.checkbox-container');

            //listeners
            birthdateForm.on('submit',function(event){
                event.preventDefault();
                submitBirthdate();
            });

            birthdateSubmit.on('click',function(event){
                event.preventDefault();
                submitBirthdate();
            });

            birthdateBack.on('click',function(event){
                event.preventDefault();
                goToPreviousScreen();
            });

            checkboxes.on('click',function(event){
                event.preventDefault();
                toggleCheckboxActiveState($(this));
            });
        }
    };

}).apply(app.views.personalProfile.birthdate);
