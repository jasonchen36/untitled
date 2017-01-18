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
            putBirthdate = apiService.updateBirthdate(formData, accountInfo);
            promiseSaveAnswers.push(putBirthdate);
          Promise.all(promiseSaveAnswers)
                .then(function(response){
                  window.location.href = '/dashboard';
                  apiService.completedProfileStatusChange(sessionData, accountInfo, formData);
                  return Promise.all(completedProfileStatusChange);
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
                    putBirthdate = apiService.updateBirthdate(formData, accountInfo);
                    promiseSaveAnswers.push(putBirthdate);
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

      birthdateDayLabelError = $('#birthdate-day-label-error-'+taxReturnId);
      birthdateMonthLabelError = $('#birthdate-month-label-error-'+taxReturnId);
      birthdateYearLabelError = $('#birthdate-year-label-error-'+taxReturnId);

      dayInput.removeClass(errorClass);
      monthInput.removeClass(errorClass);
      yearInput.removeClass(errorClass);

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
      if (!helpers.isValidFullYear(yearInput.val())){
          yearInput.addClass(errorClass);
          birthdateYearLabelError.addClass(errorClass);
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

            $(document).ready(function(){
                $(this).scrollTop(0);
            });
        }
    };

}).apply(app.views.personalProfile.birthdate);
