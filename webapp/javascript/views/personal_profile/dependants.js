(function(){

    var $ = jQuery,
        that = app.views.personalProfile.dependants,
        helpers = app.helpers,
        personalProfile = app.services.personalProfile,
        dependantsForm,
        ajax = app.ajax,
        apiservice = app.apiservice,
        dependantsSubmit,
        dependantsBack,
        dependantsEdit,
        dependantsDelete,
        errorClass = app.helpers.errorClass,
        activeClass = app.helpers.activeClass,
        disabledClass = app.helpers.disabledClass;

    function submitDependants(){
        if (!dependantsSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormDataArray(dependantsForm);
            var sessionData = personalProfile.getPersonalProfileSession();
            var accountInfo = helpers.getAccountInformation(sessionData);
            if (hasDependants.hasClass(activeClass)) {
            helpers.resetForm(dependantsForm);
            $('.'+helpers.formContainerClass).each(function(){
                validateDependantsFormData($(this));
            });
            }
            if(!helpers.formHasErrors(dependantsForm)){
                dependantsSubmit.addClass(disabledClass);
                return Promise.resolve()
                    .then(function() {
                        var promiseArrayPut = [];
                        var promiseArrayGet = [];
                        var promiseArrayQuestions = [];

                        //todo, product and question category in variable
                        var ajaxAnswers = apiservice.getQuestions(sessionData,2);
                        promiseArrayQuestions.push(ajaxAnswers);

                        _.each(formData, function(entry) {

                            //todo,
                            /*var ajaxOne =  apiservice.postAnswers(sessionData,
                             entry.taxReturnId, entry);
                             promiseArrayPut.push(ajaxOne);*/

                            var ajaxTwo = apiservice.getAnswers(sessionData,
                                entry.taxReturnId,2);

                            promiseArrayGet.push(ajaxTwo);
                        });

                        return Promise.all([Promise.all(promiseArrayPut),
                            Promise.all(promiseArrayGet),
                            Promise.all(promiseArrayQuestions)]);

                    })
                    .then(function(response) {

                        var data = {};
                        data.accountInfo = accountInfo;
                        data.taxReturns = formData;
                        data.taxReturns.questions = response[2];

                        var index = 0;
                        _.each(data.taxReturns, function(taxReturn){
                            taxReturn.firstName = nameData[index];
                            taxReturn.questions = response[1][index];
                            _.each(taxReturn.questions.answers, function(question){
                              question.answer = 0;
                              question.class = "";

                              if ( !question.text) {
                                question.answer = 0;
                                question.class = "";
                              } else if (question.text === "Yes"){
                                    question.answer = 1;
                                    question.class = "active";
                              }

                            });
                            index++;
                        });

                        personalProfile.goToNextPage(data);
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                        dependantsSubmit.removeClass(disabledClass);
                    });
              }
        }
    }

    function updateDependants(){
        if (!dependantsSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormDataArray(dependantsForm);
            var sessionData = personalProfile.getPersonalProfileSession();
            var accountInfo = helpers.getAccountInformation(sessionData);
            var nameData = helpers.getFormDataArray(dependantsForm);
            nameData = nameData[0];
                dependantsSubmit.addClass(disabledClass);
                return Promise.resolve()
                    .then(function() {
                        var promiseArrayPut = [];
                        var promiseArrayGet = [];
                        var promiseArrayQuestions = [];

                        //todo, product and question category in variable
                        var ajaxAnswers = apiservice.getQuestions(sessionData,8);
                        promiseArrayQuestions.push(ajaxAnswers);

                        _.each(formData, function(entry) {

                            //todo,
                            /*var ajaxOne =  apiservice.postAnswers(sessionData,
                             entry.taxReturnId, entry);
                             promiseArrayPut.push(ajaxOne);*/

                            var ajaxTwo = apiservice.getAnswers(sessionData,
                                entry.taxReturnId,8);

                            promiseArrayGet.push(ajaxTwo);
                        });

                        return Promise.all([Promise.all(promiseArrayPut),
                            Promise.all(promiseArrayGet),
                            Promise.all(promiseArrayQuestions)]);

                    })
                    .then(function(response) {

                        var data = {};
                        data.accountInfo = accountInfo;
                        data.taxReturns = formData;
                        data.taxReturns.questions = response[2];

                        var married = {id:"married-married", question_id:"129", class:"", instructions:"", question_text:"Married"};
                        var divorced = {id:"married-divorced", question_id:"129", class:"", instructions:"", question_text:"Divorced"};
                        var separated = {id:"married-separated", question_id:"129",  class:"", instructions:"", question_text:"Separated"};
                        var widowed = {id:"married-widowed", question_id:"129",  class:"", instructions:"", question_text:"Widowed"};
                        var commonLaw = {id:"married-common-law", question_id:"129",  class:"", instructions:"", question_text:"Common Law"};
                        var single = {id:"married-single", question_id:"129",  class:"", instructions:"", question_text:"Single"};
                        var marriageTiles = [married, divorced, separated, widowed, commonLaw, single];

                        var index = 0;
                        _.each(data.taxReturns, function(taxReturn){
                            taxReturn.questions = response[1][index];
                            taxReturn.firstName = nameData[index];
                            _.each(taxReturn.questions.answers, function(question){
                                question.tiles = marriageTiles;
                                question.answer = 0;
                                question.class = "";

                                if ( !question.text) {
                                    question.answer = 0;
                                    question.class = "";
                                } else if (question.text === "Yes"){
                                    question.answer = 1;
                                    question.class = "active";
                                }

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

    function validateDependantsFormData(dependantsForm){
        var errors = 0,
            taxReturnId = dependantsForm.attr('data-id'),
            firstName = dependantsForm.find('#dependants-first-name-'+taxReturnId),
            lastName = dependantsForm.find('#dependants-last-name-'+taxReturnId),
            day = dependantsForm.find('#dependants-birthday-day-'+taxReturnId),
            month = dependantsForm.find('#dependants-birthday-month-'+taxReturnId),
            year = dependantsForm.find('#dependants-birthday-year-'+taxReturnId),
            relationship = dependantsForm.find('#dependants-relationship-'+taxReturnId);

        firstName.removeClass(helpers.errorClass);
        lastName.removeClass(helpers.errorClass);
        day.removeClass(helpers.errorClass);
        month.removeClass(helpers.errorClass);
        year.removeClass(helpers.errorClass);
        relationship.removeClass(helpers.errorClass);

        //firstName
        if (helpers.isEmpty(firstName.val())){
            firstName.addClass(helpers.errorClass);
            errors++;
        }
        //lastName
        if (helpers.isEmpty(lastName.val())){
            lastName.addClass(helpers.errorClass);
            errors++;
        }
        //day
        if (helpers.isEmpty(day.val())){
            day.addClass(helpers.errorClass);
            errors++;
        }
        //month
        if (helpers.isEmpty(month.val())){
            month.addClass(helpers.errorClass);
            errors++;
        }
        //year
        if (helpers.isEmpty(year.val())){
            year.addClass(helpers.errorClass);
            errors++;
        }
        //relationship
        if (helpers.isEmpty(relationship.val())){
            relationship.addClass(helpers.errorClass);
            errors++;
        }
        return errors < 1;
    }

    function updateUserDependants(selectedTile,parentContainer){
        var accountSession = personalProfile.getPersonalProfileSession(),
            formData = helpers.getTileFormData(dependantsForm);
        //enforce toggle
        _.forOwn(formData[parentContainer.attr('data-id')], function(value, key) {
            if(key !== selectedTile.attr('data-id')){
                formData[parentContainer.attr('data-id')][key] = 0;
            }
        });
        //save temporary changes
        accountSession.users.forEach(function(entry){
            entry.activeTiles.dependants = formData[entry.id];
            try {
                //if "yes" is selected
                entry.hasDependants = formData[entry.id][9201];//todo, find better way of linking model id
            } catch(exception){
//do nothing
            }
        });
        personalProfile.refreshPage(accountSession);
    }

    this.init = function(){
      dependantsForm = $('#dependants-form');

        if ($('#personal-profile-dependants').length > 0) {
            var formData = helpers.getTileFormDataArray(dependantsForm);

            _.each(formData, function(taxReturn){
                hasDependants = $('#has-dependants-' + taxReturn.taxReturnId);
                var noDependants = $('#no-dependants-' + taxReturn.taxReturnId);
                var dependantsSave = $('#dependants-save-'+taxReturn.taxReturnId);
                var dependantsLine = $('#container-dependants-line-' + taxReturn.taxReturnId);
                var dependantsContainerLine = $('#dependant-name-list-'+taxReturn.taxReturnId);
                var dependantsContainerLine2 = $('#dependant-date-list-'+taxReturn.taxReturnId);
                // var dependantsContainerLine3 = $('#dependant-delete-edit-list-'+taxReturn.taxReturnId);
                var firstName = $('#dependants-first-name-'+taxReturn.taxReturnId);
                var lastName = $('#dependants-last-name-'+taxReturn.taxReturnId);
                var add = $('.i--icon-add');
                var day = $('#dependants-birthday-day-'+taxReturn.taxReturnId);
                var month = $('#dependants-birthday-month-'+taxReturn.taxReturnId);
                var year = $('#dependants-birthday-year-'+taxReturn.taxReturnId);
                var dependantsContainer = $('#container-dependants-form-'+taxReturn.taxReturnId);
                dependantsSubmit = $('#dependants-submit');
                var dependantsBack = $('#dependants-back');
                var dependantsEdit = $('#dependants-edit-'+taxReturn.taxReturnId);
                var dependantsDelete = $('#dependants-delete-'+taxReturn.taxReturnId);

                //overwrite standard tile selector active toggle
                $(document).off('click', '.'+helpers.tileClass);

                //listeners
                dependantsForm.on('submit',function(event){
                    event.preventDefault();
                    submitDependants();
                });

                dependantsSubmit.on('click',function(event){
                    event.preventDefault();
                    submitDependants();
                });

                dependantsEdit.on('click',function(event){
                    event.preventDefault();
                    //TODO: Edit dependant function
                });

                dependantsBack.on('click',function(event){
                    event.preventDefault();
                    updateDependants();
                });

                dependantsDelete.on('click',function(event){
                    event.preventDefault();
                    dependantsContainerLine.remove();
                    dependantsContainerLine2.remove();
                });

                hasDependants.on('click', function(event){
                    event.preventDefault();
                    $(this).toggleClass(helpers.activeClass);
                    noDependants.removeClass(activeClass);

                    if(hasDependants.hasClass(activeClass)) {
                        dependantsContainer.show();
                        dependantsLine.show();
                    }else{
                        dependantsContainer.hide();
                        dependantsLine.hide();
                    }
                });

                add.on('click',function(event){
                    event.preventDefault();
                    dependantsContainer.toggle();
                });

                dependantsSave.on('click',function(event){
                    event.preventDefault();
                    helpers.resetForm(dependantsContainer);
                    $('.'+helpers.formContainerClass).each(function(){
                        validateDependantsFormData($(this));
                    });
                    if(!helpers.formHasErrors(dependantsContainer)){
                    dependantsContainer.toggle();
                    dependantsContainerLine.append('<p id="side-info-blurb3-'+taxReturn.taxReturnId+'">' + firstName.val() + " " + lastName.val() + '</p>');
                    dependantsContainerLine2.append('<p id=side-info-blurb3-'+taxReturn.taxReturnId+'>' + day.val() + '/' + month.val() + '/' + year.val().slice(-2) + '</p>');
                    // dependantsContainerLine3.append('<div class="container-inline-input">'+
                    //     '<button id="dependants-delete-'+taxReturn.taxReturnId+'" class="green-outline">Delete</button>'+
                    // '</div>'+
                    // '<div class="container-inline-input">'+
                    //     '<button id="dependants-edit-'+taxReturn.taxReturnId+'" class="green-outline">Edit</button>'+
                    // '</div>');
                  }
                });

                noDependants.on('click', function(event){
                    event.preventDefault();
                    $(this).toggleClass(helpers.activeClass);
                    hasDependants.removeClass(activeClass);
                    dependantsContainer.hide();
                    dependantsLine.hide();
                });
            });

        }
    };

}).apply(app.views.personalProfile.dependants);
