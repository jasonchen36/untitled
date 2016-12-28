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
      var formData = helpers.getFormData(birthdateForm);
      helpers.resetForm(birthdateForm);
      if (helpers.isEmpty(dayInput.val().trim())){
           dayInput.addClass(errorClass);
           birthdateDayLabelError.addClass(errorClass);
      }
      if (helpers.isEmpty(monthInput.val().trim())){
           monthInput.addClass(errorClass);
          birthdateMonthLabelError.addClass(errorClass);
       }
      if (helpers.isEmpty(yearInput.val().trim())){
           yearInput.addClass(errorClass);
          birthdateYearLabelError.addClass(errorClass);
      }
      if (!helpers.formHasErrors(birthdateForm)) {
           birthdateSubmit.addClass(disabledClass);
           ajax.ajax(
               'POST',
               '/personal-profile',
               {
                 action: 'api-pp-date-of-birth',
                 data: formData
               },
               'json',
               { }
           )
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

    this.init = function(){
        if ($('#personal-profile-birthdate').length > 0) {

            //variables
            birthdateForm = $('#birthdate-form');
            birthdateSubmit = $('#birthdate-submit');
            birthdateBack = $('#birthdate-back');
            dayInput = $('#dependants-birthday-day');
            monthInput = $('#dependants-birthday-month');
            yearInput = $('#dependants-birthday-year');
            checkboxes = $('.checkbox-container');

            birthdateDayLabelError = $('#birthdate-day-label-error');
            birthdateMonthLabelError = $('#birthdate-month-label-error');
            birthdateYearLabelError = $('#birthdate-year-label-error');

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
