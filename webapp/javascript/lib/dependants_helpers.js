(function(){

  var $ = jQuery,
      that = app.views.personalProfile.dependants,
      helpers = app.helpers,
      personalProfile = app.services.personalProfile,
      ajax = app.ajax,
      saved,
      apiService = app.apiservice,
      activeClass = helpers.activeClass,
      disabledClass = helpers.disabledClass,
      thisClass = app.dependants_helpers;

  this.submitDependants = function(dependantsSubmit){
    var hasAlert = false;
    if (saved === false){
      $('#popup-blurb').html('Please Save or Cancel your dependant info before moving forward.');
      window.location.hash = 'modal-personal-profile-popup';
      hasAlert = true;
    }
      if ((!dependantsSubmit.hasClass(disabledClass)) && ((!saved) || saved === true) && hasAlert === false){
          var sessionData = personalProfile.getPersonalProfileSession(),
              accountInfo = helpers.getAccountInformation(sessionData),
              pageData = personalProfile.getPageSession(),
              nextScreenCategoryId = 2;
          dependantsSubmit.addClass(disabledClass);
          if(!thisClass.validateDependantsTiles()) {
              window.location.hash = 'modal-personal-profile-popup';
          } else {
              return Promise.resolve()
                  .then(function () {
                      var promiseSaveAnswers = thisClass.updateTileAnswers(pageData.taxReturns),
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
          }
      }
  };

  this.updateTileAnswers = function(pageData){
      var sessionData = personalProfile.getPersonalProfileSession(),
          promiseSaveAnswers = [],
          formDataEntry;
      _.each(pageData.taxReturns, function(entry){
          formDataEntry = _.find(pageData,function(dataEntry) {
              return parseInt(dataEntry.taxReturnId) === parseInt(entry.taxReturnId);
          });
          promiseSaveAnswers.push(apiService.postAnswers(sessionData, entry.taxReturnId, formDataEntry));
      });
      return promiseSaveAnswers;
  };

  this.goToPreviousScreen = function(dependantsSubmit){
      if (!dependantsSubmit.hasClass(disabledClass)) {
          var sessionData = personalProfile.getPersonalProfileSession(),
              accountInfo = helpers.getAccountInformation(sessionData),
              pageData = personalProfile.getPageSession(),
              previousScreenCategoryId = 8;
          dependantsSubmit.addClass(disabledClass);
          return Promise.resolve()
              .then(function() {
                  var promiseSaveAnswers = thisClass.updateTileAnswers(pageData.taxReturns),
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
      }
  };

  this.validateDependantsTiles = function(){
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

  this.validateDependantsFormData = function(formContainer){
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

  this.updateUserDependants = function(selectedTile){
      var pageData = personalProfile.getPageSession(),
          tileId = selectedTile.attr('id');
          _.each(pageData.taxReturns, function (taxReturn) {
              _.each(taxReturn.questions.answers, function (answer) {
                  if (answer.tax_return_id.toString() === tileId.substr(tileId.length - 3, tileId.length)){
                      if (answer.question_id.toString() === tileId.substr(0, tileId.length -4)) {
                      answer.class = helpers.activeClass;
                    } else {
                      answer.class = '';
                    }
                  }
              });
          });
          //refresh page
          personalProfile.refreshPage(pageData);
  };

  this.editDependant = function(element){
      var pageData = personalProfile.getPageSession(),
          dependentId = parseInt(element.attr('data-id')),
          hasSelectedDependant;
      _.each(pageData.taxReturns, function(taxReturn){
          hasSelectedDependant = _.find(taxReturn.dependants, {id: dependentId});
          if (hasSelectedDependant){
              taxReturn.dependantForm = hasSelectedDependant;
          }
      });
      personalProfile.refreshPage(pageData);
  };

  this.cancelEditAddDependant = function(element){
      saved = true;
      var pageData = personalProfile.getPageSession(),
          taxReturnId = parseInt(element.attr('data-tax-return-id'));
      _.each(pageData.taxReturns, function(taxReturn){
          if (parseInt(taxReturn.taxReturnId) === taxReturnId){
              delete taxReturn.dependantForm;
          }
      });
      personalProfile.refreshPage(pageData);
  };

  this.saveDependant = function(element){
      saved = true;
      var formContainer = element.parent().parent();
      if (!element.hasClass(helpers.disabledClass)){
          if(thisClass.validateDependantsFormData(formContainer)){
              var sessionData = personalProfile.getPersonalProfileSession(),
                  dependantId = element.attr('data-id'),
                  taxReturnId = parseInt(element.attr('data-tax-return-id')),
                  formData = helpers.getFormData(formContainer);
              element.addClass(helpers.disabledClass);

              if (dependantId.length > 0){
                  //update dependant
                  formData.id = parseInt(dependantId);
                  apiService.updateDependant(sessionData, taxReturnId, formData)
                      .then(function(response){
                          //get updated dependants information
                          if(formData.isShared === 1 && sessionData.taxReturns.length > 1){
                              var sharedReturnId = 0;
                              if(sessionData.taxReturns[0].taxReturnId === taxReturnId){
                                  sharedReturnId = sessionData.taxReturns[1].taxReturnId;
                              }else{
                                  sharedReturnId = sessionData.taxReturns[0].taxReturnId;
                              }
                              return apiService.linkDependant(sessionData, sharedReturnId, formData.id);
                          }
                      })
                      .then(function(){
                          return thisClass.updateDependantsTemplate();
                      });
              } else {
                  //create dependant
                  var oldResponse;
                  apiService.createDependant(sessionData, taxReturnId, formData)
                      .then(function(response){
                          oldResponse = response;
                          return apiService.linkDependant(sessionData, taxReturnId, response.dependantId);
                      })
                      .then(function(){
                          //get updated dependants information
                          if(formData.isShared === 1 && sessionData.taxReturns.length > 1){
                              var sharedReturnId = 0;
                              if(sessionData.taxReturns[0].taxReturnId === taxReturnId){
                                  sharedReturnId = sessionData.taxReturns[1].taxReturnId;
                              }else{
                                  sharedReturnId = sessionData.taxReturns[0].taxReturnId;
                              }
                              return apiService.linkDependant(sessionData, sharedReturnId, oldResponse.dependantId);
                          }
                      })
                      .then(function(){
                          //get updated dependants information
                          return thisClass.updateDependantsTemplate();
                      });
              }
          }
      }
  };

    this.shareDependant = function(element){
        element.find('.checkbox').first().toggleClass(helpers.activeClass);
    };

   this.updateDependantsTemplate = function(){
      var sessionData = personalProfile.getPersonalProfileSession(),
          pageData = personalProfile.getPageSession(),
          promiseGetDependants = [];
      return Promise.resolve()
          .then(function(){
              _.each(pageData.taxReturns, function(entry) {
                  promiseGetDependants.push(apiService.getDependants(sessionData, entry.taxReturnId));
              });
              return Promise.all(promiseGetDependants);
          })
          .then(function(response){
              //refresh template
              _.each(pageData.taxReturns, function(taxReturn, index){
                  taxReturn.dependants = response[index];
              });
              personalProfile.refreshPage(pageData);
          });
  };

   this.deleteDependant = function(element){
      if (!element.hasClass(helpers.disabledClass)){
          element.addClass(helpers.disabledClass);
          var dependantId = parseInt(element.attr('data-id')),
              taxReturnId = parseInt(element.attr('data-tax-return-id')),
              sessionData = personalProfile.getPersonalProfileSession();
          apiService.deleteDependantById(sessionData, taxReturnId, dependantId)
              .then(function(){
                  //get updated dependants information
                  return thisClass.updateDependantsTemplate();
              })
              .catch(function(jqXHR,textStatus,errorThrown){
                  ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                  element.removeClass(helpers.disabledClass);
              });
      }
  };

   this.addDependant = function(element){
      saved = false;
      var pageData = personalProfile.getPageSession(),
          taxReturnId = parseInt(element.attr('data-tax-return-id'));
      _.each(pageData.taxReturns, function(taxReturn){
          if (parseInt(taxReturn.taxReturnId) === taxReturnId){
              taxReturn.dependantForm = {};
          }
      });
      personalProfile.refreshPage(pageData);
  };

}).apply(app.dependants_helpers);
