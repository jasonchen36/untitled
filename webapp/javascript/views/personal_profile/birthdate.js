(function(){

    var $ = jQuery,
        that = app.views.personalProfile.birthdate,
        helpers = app.helpers,
        personalProfile = app.services.personalProfile,
        birthdateForm,
        ajax = app.ajax,
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
        console.log(sessionData, "this is the session data");
        var formData = helpers.getFormData(birthdateForm);
        console.log(formData, "this is the form data");
        helpers.resetForm(birthdateForm);
        $('.'+helpers.formContainerClass).each(function(){
            validateBirthdateFormData($(this));
        });
        if (!helpers.formHasErrors(birthdateForm)) {
            birthdateSubmit.addClass(disabledClass);
            var body,
                taxReturnData,
                birthdateRequests = _.map(formData, function(entry, key) {
                  console.log("this is the entry", entry);
                  console.log("this is the key", key);
                    body = {
                        accountId: accountInfo.accountId,
                        productId: accountInfo.productId,
                        dateOfBirth: "19" + entry.birthdate_year + "-" + entry.birthdate_month + "-" + entry.birthdate_day
                    };
                  console.log("this is the body", JSON.stringify(body));
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

    function toggleCheckboxActiveState(element){
        element.find('.checkbox').first().toggleClass(helpers.activeClass);
    }

    function validateBirthdateFormData(birthdateForm){
      var errors = 0;
      taxReturnId = birthdateForm.attr('data-id');
      dayInput = $('#dependants-birthday-day-'+taxReturnId);
      monthInput = $('#dependants-birthday-month-'+taxReturnId);
      yearInput = $('#dependants-birthday-year-'+taxReturnId);
      checkboxes = $('.checkbox-container');

      birthdateDayLabelError = $('#birthdate-day-label-error');
      birthdateMonthLabelError = $('#birthdate-month-label-error');
      birthdateYearLabelError = $('#birthdate-year-label-error');

      dayInput.removeClass(errorClass);
      monthInput.removeClass(errorClass);
      yearInput.removeClass(errorClass);
      checkboxes.removeClass(errorClass);

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
      if (!checkboxes.hasClass(helpers.activeClass)){
          checkboxes.addClass(errorClass);
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
                personalProfile.goToPreviousPage();
            });

            checkboxes.on('click',function(event){
                event.preventDefault();
                toggleCheckboxActiveState($(this));
            });
        }
    };

}).apply(app.views.personalProfile.birthdate);
