(function(){

    var dependantsSubmit,
        dependantsBack,
        dependantsTiles,
        dependantsEditButtons,
        dependantsDeleteButtons,
        ajax = app.ajax,
        personalProfile = app.services.personalProfile,
        dependantsAddButtons,
        saved,
        apiService = app.apiservice,
        dependantsSaveButtons,
        dependantsCancelButtons,
        dependantCheckboxes,
        helpers = app.helpers,
        activeClass = helpers.activeClass,
        disabledClass = helpers.disabledClass,
        dependants_helpers = app.dependants_helpers;

        validateDependantsTiles = function(){
          var pageData = personalProfile.getPageSession(),
              tilesAreValid = true,
              tileCount = 0;
          _.each(pageData.taxReturns, function(taxReturn){
            _.each(taxReturn.questions.answers, function (answer) {

              if (answer.answer === 1 || answer.answer === 0){
                tileCount++;
              }
           });
         });
         console.log(tileCount, pageData.taxReturns.length);
               if (tileCount === (pageData.taxReturns.length * 2)){
                 tilesAreValid = true;
               } else {
                 tilesAreValid = false;
               }
              return tilesAreValid;
        };

        updateTileAnswers = function(formData){
          var sessionData = personalProfile.getPersonalProfileSession(),
              pageData = personalProfile.getPageSession(),
              promiseSaveAnswers = [],
              answer = {};

          _.each(pageData.taxReturns, function(entry){
              answer[entry.questions.answers[0].question_id] = entry.questions.answers[0].answer;

              promiseSaveAnswers.push(apiService.postAnswers(sessionData, entry.taxReturnId, answer));
          });
          return promiseSaveAnswers;
        };

       function submitDependants(){
           if (!dependantsSubmit.hasClass(disabledClass)) {
              var hasAlert = false;
              var pageData = personalProfile.getPageSession();
              var hasDependant = dependants_helpers.hasDependant(pageData);
              if(!validateDependantsTiles()) {
                  window.location.hash = 'modal-personal-profile-popup';
                  hasAlert = true;
              } else {
              if (saved === false){
                $('#popup-blurb').html('Please Save or Cancel your dependant info before moving forward.');
                window.location.hash = 'modal-personal-profile-popup';
                hasAlert = true;
              }

              if (hasDependant === false){
                $('#popup-blurb').html('Please add dependants for each filer with dependants.');
                window.location.hash = 'modal-personal-profile-popup';
              }
              }

              if ((!dependantsSubmit.hasClass(disabledClass)) && (hasDependant === true) && ((!saved) || saved === true) && hasAlert === false){
                  var sessionData = personalProfile.getPersonalProfileSession(),
                      accountInfo = helpers.getAccountInformation(sessionData),
                      nextScreenCategoryId = 2;
                  dependantsSubmit.addClass(disabledClass);
                  dependants_helpers.submitDependants($(this));
            return Promise.resolve()
                .then(function () {
                    var promiseSaveAnswers = updateTileAnswers(formData),
                        promiseGetAnswers = [],
                        promiseArrayCategory = [],
                        promiseGetQuestions = apiService.getQuestions(sessionData, nextScreenCategoryId);
                    _.each(pageData.taxReturns, function (entry) {
                        promiseGetAnswers.push(apiService.getAddresses(sessionData, entry.taxReturnId));
                    });
                    var ajaxCategory = apiService.getCategoryById(sessionData, 12);
                    promiseArrayCategory.push(ajaxCategory);
                    return Promise.all([
                        Promise.all(promiseSaveAnswers),
                        Promise.all(promiseGetAnswers),
                        promiseGetQuestions,
                        apiService.getTaxReturns(sessionData),
                        Promise.all(promiseArrayCategory)
                    ]);
                })
                .then(function (response) {
                    var data = {};
                    data.accountInfo = accountInfo;
                    data.taxReturns = response[3];
                    data.taxReturns.questions = response[2];
                    data.taxReturns.category = response[4];
                    _.each(data.taxReturns, function (taxReturn, index) {
                        taxReturn.address = response[1][index][0];
                    });
                    personalProfile.goToNextPage(data);
                })
                .catch(function (jqXHR, textStatus, errorThrown) {
                    ajax.ajaxCatch(jqXHR, textStatus, errorThrown);
                    dependantsSubmit.removeClass(disabledClass);
                });

              }
          }
      }




       function updateDependants(){

            if (!dependantsSubmit.hasClass(disabledClass)) {
                var previousScreenCategoryId = 8,
                accountInfo = helpers.getAccountInformation(sessionData),
                    pageData = personalProfile.getPageSession();
                if (!dependantsSubmit.hasClass(disabledClass)) {
                    dependantsSubmit.addClass(disabledClass);
                    dependants_helpers.submitDependants(dependantsSubmit);
                }
                return Promise.resolve()
                    .then(function() {
                        var promiseSaveAnswers = updateTileAnswers(formData),
                            promiseGetQuestions = apiService.getQuestions(sessionData,previousScreenCategoryId),
                            promiseGetAnswers = [];
                        _.each(pageData.taxReturns, function(entry) {
                            promiseGetAnswers.push(apiService.getAnswers(sessionData,entry.taxReturnId,previousScreenCategoryId));
                        });
                        return Promise.all([
                            Promise.all(promiseSaveAnswers),
                            Promise.all(promiseGetAnswers),
                            promiseGetQuestions,
                            apiService.getTaxReturns(sessionData)
                        ]);
                    })
                    .then(function(response) {
                        var data = {};
                        data.accountInfo = accountInfo;
                        data.taxReturns = response[3];
                        data.taxReturns.questions = [];
                        data.taxReturns.questions[0] = response[2];
                        var index = 0;
                        _.each(data.taxReturns, function(taxReturn){
                            taxReturn.firstName = nameData[index];
                            taxReturn.accountInfo = accountInfo;
                            taxReturn.accountInfo.firstName = accountInfo.firstName.toUpperCase();
                            var answerIndex = 0;
                            taxReturn.questions = response[1][index];
                            _.each(taxReturn.questions.answers, function(answer){
                                if(answerIndex === 0) {
                                    answer.tiles = apiService.getMarriageTiles(taxReturn.taxReturnId, answer.text);
                                    answer.answer = 0;
                                    answer.class = "";
                                    if (!answer.text) {
                                        answer.answer = 0;
                                        answer.class = "";
                                    } else if (answer.text === "Yes") {
                                        answer.answer = 1;
                                        answer.class = helpers.activeClass;
                                    }
                                }else if(answerIndex === 1){
                                    answer.answer = 0;
                                    answer.class = "";
                                    if(answer.text === "Yes"){
                                        answer.answer = 1;
                                        answer.class = helpers.activeClass;
                                    }
                                }else{
                                    answer.day = "";
                                    answer.month= "";
                                    if(answer.text) {
                                        if (answer.text.length === 10) {
                                            answer.day = moment(answer.text).format('DD');
                                            answer.month = moment(answer.text).format('MM');
                                        }
                                    }
                                }
                                answerIndex++;
                            });
                            index++;
                        });
                        personalProfile.goToPreviousPage(data);
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                        dependantsSubmit.removeClass(disabledClass);
                    });
               }
       }


        validateDependantsFormData = function(formContainer){
            var errors = 0,
                formData = helpers.getFormData(formContainer),
                input;

            //reset form
            formContainer.find('.'+helpers.errorClass).removeClass(helpers.errorClass);

            //firstName
            if (helpers.isEmpty(formData.firstName)){
                input = formContainer.find('[name="firstName"]');
                input.addClass(helpers.errorClass);
                input.parent().find('.'+helpers.errorLabelClass).addClass(helpers.errorClass);
                errors++;
            }
            //lastName
            if (helpers.isEmpty(formData.lastName)){
                input = formContainer.find('[name="lastName"]');
                input.addClass(helpers.errorClass);
                input.parent().find('.'+helpers.errorLabelClass).addClass(helpers.errorClass);
                errors++;
            }
            //day
            if (!helpers.isValidDay(formData.day)){
                input = formContainer.find('[name="day"]');
                input.addClass(helpers.errorClass);
                input.parent().find('.'+helpers.errorLabelClass).addClass(helpers.errorClass);
                errors++;
            }
            //month
            if (!helpers.isValidMonth(formData.month)){
                input = formContainer.find('[name="month"]');
                input.addClass(helpers.errorClass);
                input.parent().find('.'+helpers.errorLabelClass).addClass(helpers.errorClass);
                errors++;
            }
            //year
            if (!helpers.isValidFullYear(formData.year)){
                input = formContainer.find('[name="year"]');
                input.addClass(helpers.errorClass);
                input.parent().find('.'+helpers.errorLabelClass).addClass(helpers.errorClass);
                errors++;
            }
            //relationship
            if (helpers.isEmpty(formData.relationship)){
                input = formContainer.find('[name="relationship"]');
                input.addClass(helpers.errorClass);
                input.parent().parent().find('.'+helpers.errorLabelClass).addClass(helpers.errorClass);
                errors++;
            }
            return errors < 1;
        };

    this.init = function(){
        if ($('#personal-profile-dependants').length > 0) {
            //variables
            dependantsSubmit = $('#dependants-submit');
            dependantsForm = $('#dependants-form');
            formData = helpers.getTileFormDataArray(dependantsForm);
            sessionData = personalProfile.getPersonalProfileSession();
            dependantsBack = $('#dependants-back');
            dependantsYesButtons = $('.dependants-button-yes');
            dependantsNoButtons = $('.dependants-button-no');
            dependantsEditButtons = $('.dependants-button-edit');
            dependantsDeleteButtons = $('.dependants-button-delete');
            dependantsAddButtons = $('.dependants-button-add');
            dependantsSaveButtons = $('.dependants-button-save');
            dependantsCancelButtons = $('.dependants-button-cancel');
            dependantCheckboxes = $('.checkbox-container');

            //listeners
            dependantsBack.on('click',function(event){
                event.preventDefault();
                updateDependants();
            });

            dependantsForm.on('submit',function(event){
                event.preventDefault();
                submitDependants();
            });

            dependantsSubmit.on('click',function(event){
                event.preventDefault();
                submitDependants();
            });

            dependantsYesButtons.on('click',function(event){
                event.preventDefault();
                var tileId = $(this).attr('data-id');
                var taxReturnId = $(this).attr('data-tr-id');
                personalProfile.refreshPage(dependants_helpers.setDependantsOn(taxReturnId ,tileId));
            });

            dependantsNoButtons.on('click',function(event){
                event.preventDefault();
                var tileId = $(this).attr('data-id');
                var taxReturnId = $(this).attr('data-tr-id');
                personalProfile.refreshPage(dependants_helpers.setDependantsOff(taxReturnId ,tileId));
            });

            dependantsEditButtons.on('click',function(event){
                event.preventDefault();
                var dependantId = parseInt($(this).attr('data-id').split('-')[0]);
                var firstName = $(this).attr('data-id').split('-')[1];
                var lastName = $(this).attr('data-id').split('-')[2];
                personalProfile.refreshPage(dependants_helpers.editDependant(dependantId, firstName, lastName));
            });

            dependantsDeleteButtons.on('click',function(event){
              var dependantId = parseInt($(this).attr('data-id').split('-')[0]);
              var firstName = $(this).attr('data-id').split('-')[1];
              var lastName = $(this).attr('data-id').split('-')[2];
                  if (!dependantsDeleteButtons.hasClass(helpers.disabledClass)){
                      dependantsDeleteButtons.addClass(helpers.disabledClass);
                    }
                event.preventDefault();
                personalProfile.refreshPage(dependants_helpers.deleteDependant(dependantId, firstName, lastName));
            });

            dependantsAddButtons.on('click',function(event){
                event.preventDefault();
                saved = false;
                taxReturnId = parseInt($(this).attr('data-tax-return-id'));
                personalProfile.refreshPage(dependants_helpers.addDependant(taxReturnId));
            });

            dependantsSaveButtons.on('click',function(event){
                event.preventDefault();
                saved = true;
                var dependantId = parseInt($(this).attr('data-id').split('-')[0]),
                firstName = $(this).attr('data-id').split('-')[1],
                lastName = $(this).attr('data-id').split('-')[2],
                taxReturnId = parseInt($(this).attr('data-tax-return-id')),
                formContainer = dependantsSaveButtons.parent().parent(),
                formData = helpers.getFormData(formContainer);
                if (!dependantsSaveButtons.hasClass(helpers.disabledClass)){
                    if(validateDependantsFormData(formContainer)){
                        dependantsSaveButtons.addClass(helpers.disabledClass);
                        personalProfile.refreshPage(dependants_helpers.saveDependant(dependantId, firstName, lastName, taxReturnId, formData));
                    }
                }
            });

            dependantsCancelButtons.on('click',function(event){
                event.preventDefault();
                var taxReturnId = parseInt($(this).attr('data-tax-return-id'));
                saved = true;
                personalProfile.refreshPage(dependants_helpers.cancelEditAddDependant(taxReturnId));
            });

            dependantCheckboxes.on('click',function(event){
                event.preventDefault();
                dependantCheckboxes.find('.checkbox').first().toggleClass(helpers.activeClass);
            });

            $(document).ready(function(){
                $(this).scrollTop(0);
            });

        }
    };

}).apply(app.views.personalProfile.dependants);
