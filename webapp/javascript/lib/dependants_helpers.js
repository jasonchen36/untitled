(function(){

  var $ = jQuery,
      that = app.views.personalProfile.dependants,
      helpers = app.helpers,
      personalProfile = app.services.personalProfile,
      ajax = app.ajax,
      apiService = app.apiservice,
      activeClass = helpers.activeClass,
      disabledClass = helpers.disabledClass,
      thisClass = app.dependants_helpers;

  this.submitDependants = function(dependantsSubmit){
    var sessionData = personalProfile.getPersonalProfileSession(),
        accountInfo = helpers.getAccountInformation(sessionData),
        pageData = personalProfile.getPageSession(),
        nextScreenCategoryId = 2;

        _.each(pageData.taxReturns, function(taxReturn){
          _.each(taxReturn.questions.dependants, function (dependant) {
              if (parseInt(dependant.id).length > 0){
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
              } else if (dependant.isEmptyObject()){
                    apiService.deleteDependantById(sessionData, taxReturnId, dependantId)
                  .then(function(){
                      //get updated dependants information
                      return thisClass.updateDependantsTemplate();
                  })
                  .catch(function(jqXHR,textStatus,errorThrown){
                      ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                      element.removeClass(helpers.disabledClass);
                  });
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
          });
        });
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
    var pageData = personalProfile.getPageSession();
    _.each(pageData.taxReturns, function(taxReturn){
      _.each(taxReturn.questions.dependants, function (dependant) {
          if (parseInt(dependant.id).length > 0){
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
          } else if (dependant.isEmptyObject()){
                apiService.deleteDependantById(sessionData, taxReturnId, dependantId)
              .then(function(){
                  //get updated dependants information
                  return thisClass.updateDependantsTemplate();
              })
              .catch(function(jqXHR,textStatus,errorThrown){
                  ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                  element.removeClass(helpers.disabledClass);
              });
          } else {
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
        });
      });
    };

  this.toggleDependants = function(tileId){
      var pageData = personalProfile.getPageSession();
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
          return pageData;
  };

  this.editDependant = function(dependantId){
      var pageData = personalProfile.getPageSession(),
          hasSelectedDependant;
      _.each(pageData.taxReturns, function(taxReturn){
          hasSelectedDependant = _.find(taxReturn.dependants, {id: dependantId});
          if (hasSelectedDependant){
              taxReturn.dependantForm = hasSelectedDependant;
          }
      });
      return pageData;
  };

  this.cancelEditAddDependant = function(taxReturnId){
      var pageData = personalProfile.getPageSession();
      _.each(pageData.taxReturns, function(taxReturn){
          if (parseInt(taxReturn.taxReturnId) === taxReturnId){
              delete taxReturn.dependantForm;
          }
      });
      return pageData;
  };

  this.saveDependant = function(dependantId, taxReturnId, formContainer){
              var sessionData = personalProfile.getPersonalProfileSession(),
                  pageData = personalProfile.getPageSession(),
                  formData = helpers.getFormData(formContainer);
              if (dependantId.length > 0){
                  //update dependant
                  formData.id = parseInt(dependantId);
                  _.each(pageData.taxReturns, function(taxReturn){
                    _.each(taxReturn.questions.dependants, function (dependant) {
                      if (parseInt(taxReturn.taxReturnId) === taxReturnId){
                        if (parseInt(dependant.id) === dependantId){
                          dependant.id = formData.id;
                          dependant.first_name = formData.firstName;
                          dependant.last_name = formData.lastName;
                          dependant.date_of_birth = formData.dateOfBirth;
                          dependant.relationship = formData.relationship;
                          dependant.is_shared = formData.isShared;
                        }
                      }
                    });
                  });
              } else {
                _.each(pageData.taxReturns, function(taxReturn){
                    if (parseInt(taxReturn.taxReturnId) === taxReturnId){
                      taxReturn.questions.dependants.push({
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        date_of_birth: formData.dateOfBirth,
                        relationship: formData.relationship,
                        is_shared :formData.isShared
                      });
                  }
              });
            }
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

   this.deleteDependant = function(taxReturnId, dependantId){
          var sessionData = personalProfile.getPersonalProfileSession(),
              pageData = personalProfile.getPageSession();
              _.each(pageData.taxReturns, function(taxReturn){
                _.each(taxReturn.questions.dependants, function (dependant) {
                  if (parseInt(taxReturn.taxReturnId) === taxReturnId){
                    if (parseInt(dependant.id) === dependantId){
                      dependant = {};
                    }
                  }
                });
              });
              return pageData;
  };

   this.addDependant = function(taxReturnId){
      var pageData = personalProfile.getPageSession();
      _.each(pageData.taxReturns, function(taxReturn){
          if (parseInt(taxReturn.taxReturnId) === taxReturnId){
              taxReturn.dependantForm = {};
          }
      });
      return pageData;
  };

}).apply(app.dependants_helpers);
