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
              if (answer.class === "active"){
                tileCount++;
              }
           });
         });
               if (tileCount === pageData.taxReturns.length){
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
              formDataEntry;
          _.each(pageData.taxReturns, function(entry){
              formDataEntry = _.find(formData,function(dataEntry) {
                  return parseInt(dataEntry.taxReturnId) === parseInt(entry.taxReturnId);
              });
              promiseSaveAnswers.push(apiService.postAnswers(sessionData, entry.taxReturnId, formDataEntry));
          });
          return promiseSaveAnswers;
        };

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
            dependantsTiles = $('.'+helpers.tileClass);
            dependantsEditButtons = $('.dependants-button-edit');
            dependantsDeleteButtons = $('.dependants-button-delete');
            dependantsAddButtons = $('.dependants-button-add');
            dependantsSaveButtons = $('.dependants-button-save');
            dependantsCancelButtons = $('.dependants-button-cancel');
            dependantCheckboxes = $('.checkbox-container');

            //listeners
            dependantsBack.on('click',function(event){
                event.preventDefault();
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
                        data.taxReturns.questions = response[2];
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
            });

            dependantsForm.on('submit',function(event){
              event.preventDefault();
              var hasAlert = false;
              var pageData = personalProfile.getPageSession();
              if (saved === false){
                $('#popup-blurb').html('Please Save or Cancel your dependant info before moving forward.');
                window.location.hash = 'modal-personal-profile-popup';
                hasAlert = true;
              }
              console.log('went here');
              var hasDependant = dependants_helpers.hasDependant(pageData);
              console.log(hasDependant);
              if (hasDependant === false){
                $('#popup-blurb').html('Please add dependants for each filer with dependants.');
                window.location.hash = 'modal-personal-profile-popup';
              }
              if ((!dependantsSubmit.hasClass(disabledClass)) && (hasDependant === true) && ((!saved) || saved === true) && hasAlert === false){
                  var sessionData = personalProfile.getPersonalProfileSession(),
                      accountInfo = helpers.getAccountInformation(sessionData),
                      nextScreenCategoryId = 2;
                  dependantsSubmit.addClass(disabledClass);
                  if(!validateDependantsTiles()) {
                      window.location.hash = 'modal-personal-profile-popup';
                  } else {
                      dependants_helpers.submitDependants($(this));
                }
            }
            return Promise.resolve()
                .then(function () {
                    var promiseSaveAnswers = updateTileAnswers(formData),
                        promiseGetAnswers = [],
                        promiseGetQuestions = apiService.getQuestions(sessionData, nextScreenCategoryId);
                    _.each(pageData.taxReturns, function (entry) {
                        promiseGetAnswers.push(apiService.getAddresses(sessionData, entry.taxReturnId));
                    });
                    return Promise.all([
                        Promise.all(promiseSaveAnswers),
                        Promise.all(promiseGetAnswers),
                        promiseGetQuestions,
                        apiService.getTaxReturns(sessionData)
                    ]);
                })
                .then(function (response) {
                    var data = {};
                    data.accountInfo = accountInfo;
                    data.taxReturns = response[3];
                    data.taxReturns.questions = response[2];
                    _.each(data.taxReturns, function (taxReturn, index) {
                        taxReturn.address = response[1][index][0];
                    });
                    personalProfile.goToNextPage(data);
                })
                .catch(function (jqXHR, textStatus, errorThrown) {
                    ajax.ajaxCatch(jqXHR, textStatus, errorThrown);
                    dependantsSubmit.removeClass(disabledClass);
                });
            });

            dependantsSubmit.on('click',function(event){
                event.preventDefault();
                var hasAlert = false;
                var pageData = personalProfile.getPageSession();
                if (saved === false){
                  $('#popup-blurb').html('Please Save or Cancel your dependant info before moving forward.');
                  window.location.hash = 'modal-personal-profile-popup';
                  hasAlert = true;
                }
                var hasDependant = dependants_helpers.hasDependant(pageData);
                if (hasDependant === false){
                  $('#popup-blurb').html('Please add dependants for each filer with dependants.');
                  window.location.hash = 'modal-personal-profile-popup';
                }
                if ((!dependantsSubmit.hasClass(disabledClass)) && (hasDependant === true) && ((!saved) || saved === true) && hasAlert === false){
                    var sessionData = personalProfile.getPersonalProfileSession(),
                        accountInfo = helpers.getAccountInformation(sessionData),
                        nextScreenCategoryId = 2;
                    dependantsSubmit.addClass(disabledClass);
                    if(!validateDependantsTiles()) {
                        window.location.hash = 'modal-personal-profile-popup';
                    } else {
                        dependants_helpers.submitDependants($(this));
                  }

              return Promise.resolve()
                  .then(function () {
                      var promiseSaveAnswers = updateTileAnswers(formData),
                          promiseGetAnswers = [],
                          promiseArrayCategory = [],
                          promiseGetQuestions = apiService.getQuestions(sessionData, nextScreenCategoryId);

                      var ajaxCategory = apiService.getCategoryById(sessionData, 12);
                      promiseArrayCategory.push(ajaxCategory);

                      _.each(pageData.taxReturns, function (entry) {
                          promiseGetAnswers.push(apiService.getAddresses(sessionData, entry.taxReturnId));
                      });
                      return Promise.all([
                          Promise.all(promiseSaveAnswers),
                          Promise.all(promiseGetAnswers),
                          promiseGetQuestions,
                          apiService.getTaxReturns(sessionData),
                          Promise.all(promiseArrayCategory),
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
            });

            dependantsTiles.on('click',function(event){
                event.preventDefault();
                var tileId = $(this).attr('id');
                personalProfile.refreshPage(dependants_helpers.toggleDependants(tileId));
            });

            dependantsEditButtons.on('click',function(event){
                event.preventDefault();
                var dependantId = parseInt($(this).attr('data-id'));
                personalProfile.refreshPage(dependants_helpers.editDependant(dependantId));
            });

            dependantsDeleteButtons.on('click',function(event){
              var dependantId = parseInt($(this).attr('data-id'));
                  if (!dependantsDeleteButtons.hasClass(helpers.disabledClass)){
                      dependantsDeleteButtons.addClass(helpers.disabledClass);
                    }
                event.preventDefault();
                personalProfile.refreshPage(dependants_helpers.deleteDependant(dependantId));
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
                var dependantId = $(this).attr('data-id'),
                taxReturnId = parseInt($(this).attr('data-tax-return-id')),
                formContainer = dependantsSaveButtons.parent().parent();
                if (!dependantsSaveButtons.hasClass(helpers.disabledClass)){
                    if(validateDependantsFormData(formContainer)){
                        dependantsSaveButtons.addClass(helpers.disabledClass);
                        personalProfile.refreshPage(dependants_helpers.saveDependant(dependantId, taxReturnId, formContainer));
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
