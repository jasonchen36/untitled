(function(){

  var $ = jQuery,
      that = app.views.personalProfile.dependants,
      helpers = app.helpers,
      personalProfile = app.services.personalProfile,
      apiService = app.apiservice,
      activeClass = helpers.activeClass,
      disabledClass = helpers.disabledClass,
      thisClass = app.dependants_helpers;

  this.hasDependant = function(pageData){
    var hasDependant = true;
    _.each(pageData.taxReturns, function (taxReturn) {
            if (taxReturn.dependants.length === 0 && taxReturn.questions.answers[0].class.toLowerCase() === "Active".toLowerCase()){
              hasDependant = false;
            }
    });
    return hasDependant;
  };

  this.submitDependants = function(dependantsSubmit){
    var sessionData = personalProfile.getPersonalProfileSession(),
        accountInfo = helpers.getAccountInformation(sessionData),
        pageData = personalProfile.getPageSession();
        _.each(pageData.taxReturns, function(taxReturn){
          _.each(taxReturn.dependants, function (dependant) {
              if ((dependant.create !== true) && (dependant.will_delete !== true)){
                apiService.updateDependant(sessionData, taxReturn.taxReturnId, dependant)
                .then(function(response){
                          //get updated dependants information
                          if(dependant.isShared === 1 && sessionData.taxReturns.length > 1){
                              var sharedReturnId = 0;
                              if(sessionData.taxReturns[0].taxReturnId === taxReturn.taxReturnId){
                                  sharedReturnId = sessionData.taxReturns[1].taxReturnId;
                              }else{
                                  sharedReturnId = sessionData.taxReturns[0].taxReturnId;
                              }
                              return apiService.linkDependant(sessionData, sharedReturnId, dependant.id);
                          }
                      });
              } else if (dependant.will_delete === true){
                    apiService.deleteDependantById(sessionData, taxReturn.taxReturnId, dependant.id);
              } else {
                  apiService.createDependant(sessionData, taxReturn.taxReturnId, dependant)
                      .then(function(response){
                          return apiService.linkDependant(sessionData, taxReturn.taxReturnId, response.dependantId);
                      })
                      .then(function(){
                          //get updated dependants information
                          if(dependant.isShared === 1 && sessionData.taxReturns.length > 1){
                              var sharedReturnId = 0;
                              if(sessionData.taxReturns[0].taxReturnId === taxReturn.taxReturnId){
                                  sharedReturnId = sessionData.taxReturns[1].taxReturnId;
                              }else{
                                  sharedReturnId = sessionData.taxReturns[0].taxReturnId;
                              }
                              return apiService.linkDependant(sessionData, sharedReturnId, response.dependantId);
                          }
                      });
              }
            });
          });
  };

  this.toggleDependants = function(tileId){
      var pageData = personalProfile.getPageSession();
          _.each(pageData.taxReturns, function (taxReturn) {
              _.each(taxReturn.questions.answers, function (answer) {
                  if (!answer.tax_return_id){
                        if (answer.question_id.toString() === tileId.substr(0, tileId.length -4)){
                          answer.class = helpers.activeClass;
                        } else {
                            answer.class = '';
                        }
                  } else if (answer.tax_return_id.toString() === tileId.substr(tileId.length - 3, tileId.length)){
                        if (answer.question_id.toString() === tileId.substr(0, tileId.length -4)){
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
              if (dependantId){
                  //update dependant
                  formData.id = parseInt(dependantId);
                  _.each(pageData.taxReturns, function(taxReturn){
                    _.each(taxReturn.dependants, function (dependant) {
                      if (parseInt(taxReturn.taxReturnId) === taxReturnId){
                        delete taxReturn.dependantForm;
                        if (parseInt(dependant.id) === parseInt(dependantId)){
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
                      delete taxReturn.dependantForm;
                      taxReturn.dependants.push({
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        tax_return_id: taxReturn.taxReturnId,
                        year: formData.year,
                        month: formData.month,
                        day: formData.day,
                        relationship: formData.relationship,
                        is_shared :formData.isShared,
                        create: true
                      });
                  }
              });
            }
            return pageData;
   };

   this.deleteDependant = function(dependantId){
          var sessionData = personalProfile.getPersonalProfileSession(),
              pageData = personalProfile.getPageSession();
              _.each(pageData.taxReturns, function(taxReturn){
                  hasSelectedDependant = _.find(taxReturn.dependants, {id: dependantId});
                    if (hasSelectedDependant){
                      hasSelectedDependant.will_delete = true;
                    }
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
