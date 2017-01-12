(function(){

    var dependantsSubmit,
        dependantsBack,
        dependantsTiles,
        dependantsEditButtons,
        dependantsDeleteButtons,
        personalProfile = app.services.personalProfile,
        dependantsAddButtons,
        saved,
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

    this.init = function(){
        if ($('#personal-profile-dependants').length > 0) {
            //variables
            dependantsSubmit = $('#dependants-submit');
            dependantsForm = $('#dependants-form');
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
                if (!dependantsSubmit.hasClass(disabledClass)) {
                    var sessionData = personalProfile.getPersonalProfileSession(),
                        accountInfo = helpers.getAccountInformation(sessionData),
                        pageData = personalProfile.getPageSession(),
                        previousScreenCategoryId = 8;
                    dependantsSubmit.addClass(disabledClass);
                dependants_helpers.goToPreviousScreen(dependantsSubmit);
                }
            });

            dependantsForm.on('submit',function(event){
                event.preventDefault();
                dependants_helpers.submitDependants(dependantsSubmit);
            });

            dependantsSubmit.on('click',function(event){
                event.preventDefault();
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
                        console.log(pageData);
                    dependantsSubmit.addClass(disabledClass);
                    if(!validateDependantsTiles()) {
                        window.location.hash = 'modal-personal-profile-popup';
                    } else {
                dependants_helpers.submitDependants($(this));
                  }
              }
            });

            dependantsTiles.on('click',function(event){
                event.preventDefault();
                var tileId = dependantsTiles.attr('id');
                personalProfile.refreshPage(dependants_helpers.toggleDependants(tileId));
            });

            dependantsEditButtons.on('click',function(event){
                event.preventDefault();
                var dependantId = parseInt(element.attr('data-id'));
                personalProfile.refreshPage(dependants_helpers.editDependant(dependantId));
            });

            dependantsDeleteButtons.on('click',function(event){
              var dependantId = parseInt(dependantsDeleteButtons.attr('data-id')),
                  taxReturnId = parseInt(dependantsDeleteButtons.attr('data-tax-return-id'));
                  if (!element.hasClass(helpers.disabledClass)){
                      element.addClass(helpers.disabledClass);
                    }
                event.preventDefault();
                dependants_helpers.deleteDependant(dependentId, taxReturnId);
            });

            dependantsAddButtons.on('click',function(event){
                event.preventDefault();
                saved = false;
                taxReturnId = parseInt(dependantsAddButtons.attr('data-tax-return-id'));
                personalProfile.refreshPage(dependants_helpers.addDependant(taxReturnId));
            });

            dependantsSaveButtons.on('click',function(event){
                event.preventDefault();
                saved = true;
                dependants_helpers.saveDependant($(this));
            });

            dependantsCancelButtons.on('click',function(event){
                event.preventDefault();
                var taxReturnId = parseInt(element.attr('data-tax-return-id'));
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
