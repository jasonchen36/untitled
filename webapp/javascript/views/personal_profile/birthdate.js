(function(){

    var $ = jQuery,
        that = app.views.personalProfile.birthdate,
        helpers = app.helpers,
        personalProfile = app.services.personalProfile,
        birthdateForm,
        ajax = app.ajax,
        birthdateSubmit,
        birthdateBack,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitBirthdate(){
      var formData = helpers.getFormData(birthdateForm);
      helpers.resetForm(birthdateForm);
      if (dayInput.val().length === 0){
           dayInput.addClass(errorClass);
           alert("Pleae enter the day correctly");
      }
      if (monthInput.val().length === 0){
           monthInput.addClass(errorClass);
           alert("Pleae enter the month correctly");
       }
      if (yearInput.val().length === 0){
           yearInput.addClass(errorClass);
           alert("Pleae enter the year correctly");
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
               'json'
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

    this.init = function(){
        if ($('#personal-profile-birthdate').length > 0) {

            //variables
            birthdateForm = $('#birthdate-form');
            birthdateSubmit = $('#birthdate-submit');
            birthdateBack = $('#birthdate-back');
            dayInput = $('#dependants-birthday-day');
            monthInput = $('#dependants-birthday-month');
            yearInput = $('#dependants-birthday-year');
            checkbox = $('.checkbox');

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

            checkbox.on('click',function(event){
                event.preventDefault();
                $(this).toggleClass(helpers.activeClass);
            });
        }
    };

}).apply(app.views.personalProfile.birthdate);
