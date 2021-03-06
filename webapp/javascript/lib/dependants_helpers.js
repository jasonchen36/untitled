(function(){

  var $ = jQuery,
      that = app.views.personalProfile.dependants,
      helpers = app.helpers,
      personalProfile = app.services.personalProfile,
      apiService = app.apiservice,
      activeClass = helpers.activeClass,
      disabledClass = helpers.disabledClass,
      thisClass = app.dependants_helpers;


  this.setSharedToggle = function(taxReturnId, dependantsForm, isShared){
      _.each(pageData.taxReturns, function(taxReturn){
                 if (taxReturn.taxReturnId === taxReturnId){
                      if (isShared === 1){
                          dependantShared = dependantsForm.find('#shared-'+taxReturn.taxReturnId);
                          dependantShared.addClass(activeClass);
                      } else if (isShared === 0){
                          dependantShared = dependantsForm.find('#shared-'+taxReturn.taxReturnId);
                          dependantShared.removeClass(activeClass);
                      }
                 }
      });
  };

  this.hasDependant = function(pageData){
    var hasDependant = true;
    _.each(pageData.taxReturns, function (taxReturn) {
            if (taxReturn.dependants.length === 0 && taxReturn.questions.answers[0].answer === 1){
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
                          if(dependant.is_shared === 1 && sessionData.taxReturns.length > 1){
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
                          if(dependant.is_shared === 1 && sessionData.taxReturns.length > 1){
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

  this.setDependantsToggle = function(taxReturnId ,tileId){
      var pageData = personalProfile.getPageSession();

          _.each(pageData.taxReturns, function (taxReturn) {
              _.each(taxReturn.questions.answers, function (answer) {
                  if (answer.tax_return_id == taxReturnId && answer.question_id == tileId){
                      answer.answer = 1;
                  } else if (answer.tax_return_id == taxReturnId){
                      answer.answer = 0;
                  }
              });
          });
          return pageData;
  };

  this.editDependant = function(taxReturnId, dependantId, firstName, lastName){
      var pageData = personalProfile.getPageSession(),
          hasSelectedDependant;
      _.each(pageData.taxReturns, function(taxReturn){

          if(taxReturn.taxReturnId == taxReturnId) {
          _.each(taxReturn.dependants, function (dependant) {
              hasSelectedDependant = _.find(taxReturn.dependants, {id: dependantId});
              if (!hasSelectedDependant){
                hasSelectedDependant = _.find(taxReturn.dependants, {first_name: firstName, last_name: lastName});
              }

              if(hasSelectedDependant){
                  taxReturn.dependantForm = hasSelectedDependant;
               }

              if(dependant.is_shared === 1) {
                  taxReturn.dependantForm.isSharedClass = 'active';
              }else{
                  taxReturn.dependantForm.isSharedClass = '';
              }
          });

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

  this.saveDependant = function(dependantId, firstName, lastName, taxReturnId, formData){
         
              pageData = personalProfile.getPageSession();

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

                          thisClass.saveSharedDependant(pageData, taxReturn, dependant);

                        }
                      }
                    });
                  });
              } else if((firstName) && (lastName)){

                _.each(pageData.taxReturns, function(taxReturn){
                  _.each(taxReturn.dependants, function (dependant) {
                    if (parseInt(taxReturn.taxReturnId) === taxReturnId){
                      delete taxReturn.dependantForm;
                      if ((dependant.first_name === firstName) && (dependant.last_name === lastName)){
                        dependant.first_name = formData.firstName;
                        dependant.last_name = formData.lastName;
                        dependant.date_of_birth = formData.dateOfBirth;
                        dependant.relationship = formData.relationship;
                        dependant.is_shared = formData.isShared;

                        thisClass.saveSharedDependant(pageData, taxReturn, dependant);
                      }
                    }
                  });
                });
              } else {
                _.each(pageData.taxReturns, function(taxReturn){
                    if (parseInt(taxReturn.taxReturnId) === taxReturnId){
                      delete taxReturn.dependantForm;

                      var dependant = {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        tax_return_id: taxReturn.taxReturnId,
                        year: formData.year,
                        month: formData.month,
                        day: formData.day,
                        relationship: formData.relationship,
                        is_shared :formData.isShared,
                        create: true
                      };
                      taxReturn.dependants.push(dependant);

                      thisClass.saveSharedDependant(pageData, taxReturn, dependant);

                    }
                   });
              }
    
            return pageData;
   };



   this.saveSharedDependant = function(pageData, taxReturn, dependant){
         
      var sharedTaxReturn = null;

      if(taxReturn.filerType === "primary") {
         sharedTaxReturn =  thisClass.getTaxReturnByFilerType(pageData, "spouse");
      }  else if(taxReturn.filerType === "spouse")  {
         sharedTaxReturn =  thisClass.getTaxReturnByFilerType(pageData, "primary");
      }
       

      if(sharedTaxReturn != null) {
          if(dependant.is_shared === 1)  {
     
              var sharedDependantFound = false;

              if(typeof sharedTaxReturn.dependants !== 'undefined' && sharedTaxReturn.dependants != null) { 

                  _.each(sharedTaxReturn.dependants, function (sharedDependant) {
                      if(sharedDependant == dependant) {
                          sharedDependantFound = true;
                      }
                  });
              }
              if(!sharedDependantFound) {
                  sharedTaxReturn.dependants.push(dependant);
              }
         } 

         var yesTileId = 135;
         var noTileId = 136;
         if(typeof sharedTaxReturn.questions !== 'undefined'
            && typeof sharedTaxReturn.questions .answers!== 'undefined') { 

             _.each(sharedTaxReturn.questions.answers, function (answer) {
                 if (answer.question_id == yesTileId){
                      answer.answer = (sharedTaxReturn.dependants.length == 0) ? 0 : 1;
                 }
                 if (answer.question_id == noTileId){
                      answer.answer = (sharedTaxReturn.dependants.length == 0) ? 1 : 0;
                 }
             });
          }
  
      }
 
   };




   this.getTaxReturnByFilerType = function(pageData, filerType){
         var found = null;
       _.each(pageData.taxReturns, function(taxReturn){
           if (taxReturn.filerType === filerType) {
               found = taxReturn;
           }
       });

       return found;
   };


   this.deleteDependant = function(taxReturnId , dependantId, firstName, lastName){
          var sessionData = personalProfile.getPersonalProfileSession(),
              pageData = personalProfile.getPageSession();

          _.each(pageData.taxReturns, function(taxReturn){
               if(taxReturn.taxReturnId == taxReturnId) {

                  hasSelectedDependant = _.find(taxReturn.dependants, {id: dependantId});
                    if (!hasSelectedDependant){
                      hasSelectedDependant = _.find(taxReturn.dependants, {first_name: firstName, last_name: lastName});
                     }
                     if(hasSelectedDependant){
                         hasSelectedDependant.will_delete = true;
                     }
                  
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
