(function(){

    var $ = jQuery,
        that = app.views.personalProfile.dependants,
        helpers = app.helpers,
        personalProfile = app.services.personalProfile,
        dependantsForm,
        ajax = app.ajax,
        apiService = app.apiservice,
        dependantsSubmit,
        dependantsBack,
        activeClass = helpers.activeClass,
        disabledClass = helpers.disabledClass;

    function submitDependants(){
        if (!dependantsSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormDataArray(dependantsForm),
                sessionData = personalProfile.getPersonalProfileSession(),
                accountInfo = helpers.getAccountInformation(sessionData),
                nextScreenCategoryId = 2;
            //todo, form validation
            helpers.resetForm(dependantsForm);
            $('.'+helpers.formContainerClass).each(function(){
                validateDependantsFormData($(this));
            });
            if(!helpers.formHasErrors(dependantsForm)){
                dependantsSubmit.addClass(disabledClass);
                return Promise.resolve()
                    .then(function() {
                        var promiseSaveAnswers = updateDependants(),
                            promiseGetAnswers = [],
                            promiseGetQuestions = apiService.getQuestions(sessionData,nextScreenCategoryId);
                        _.each(formData, function(entry) {
                            promiseGetAnswers.push(apiService.getAnswers(sessionData,entry.taxReturnId,nextScreenCategoryId));
                        });
                        return Promise.all([
                            Promise.all(promiseSaveAnswers),
                            Promise.all(promiseGetAnswers),
                            promiseGetQuestions
                        ]);
                    })
                    .then(function(response) {
                        var data = {};
                        data.accountInfo = accountInfo;
                        data.taxReturns = formData;
                        data.taxReturns.questions = response[2];
                        _.each(data.taxReturns, function(taxReturn, index){
                            taxReturn.firstName = nameData[index];
                            taxReturn.questions = response[1][index];
                            _.each(taxReturn.questions.answers, function(question){
                                question.answer = 0;
                                question.class = '';
                                if (!question.text) {
                                    question.answer = 0;
                                    question.class = '';
                                } else if (question.text === 'Yes'){
                                    question.answer = 1;
                                    question.class = activeClass;
                                }

                            });
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
        //todo, return array of promises
        return [];
    }

    function goToPreviousScreen(){
        if (!dependantsSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormDataArray(dependantsForm),
                sessionData = personalProfile.getPersonalProfileSession(),
                accountInfo = helpers.getAccountInformation(sessionData),
                nameData = helpers.getFormDataArray(dependantsForm),
                previousScreenCategoryId = 8;
            nameData = nameData[0];
            dependantsSubmit.addClass(disabledClass);
            return Promise.resolve()
                .then(function() {
                    var promiseSaveAnswers = updateDependants(),
                        promiseGetQuestions = apiService.getQuestions(sessionData,previousScreenCategoryId),
                        promiseGetAnswers = [];
                    _.each(formData, function(entry) {
                        promiseGetAnswers.push(apiService.getAnswers(sessionData,entry.taxReturnId,previousScreenCategoryId));
                    });
                    return Promise.all([
                        Promise.all(promiseSaveAnswers),
                        Promise.all(promiseGetAnswers),
                        promiseGetQuestions
                    ]);
                })
                .then(function(response) {
                    var data = {};
                    data.accountInfo = accountInfo;
                    data.taxReturns = sessionData.taxReturns;
                    data.taxReturns.questions = response[2];
                    _.each(data.taxReturns, function(taxReturn, index){
                        taxReturn.questions = response[1][index];
                        taxReturn.firstName = nameData[index];
                        taxReturn.accountInfo = accountInfo;
                        taxReturn.accountInfo.firstName = accountInfo.firstName.toUpperCase();
                        _.each(taxReturn.questions.answers, function(answer){
                            answer.tiles = apiService.getMarriageTiles(taxReturn.taxReturnId, answer.text);
                        });
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
            relationship = dependantsForm.find('#dependants-relationship-'+taxReturnId),

            firstNameLabelError = dependantsForm.find('#dependants-first-name-label-error-'+taxReturnId),
            lastNameLabelError = dependantsForm.find('#dependants-last-name-label-error-'+taxReturnId),
            dayLabelError = dependantsForm.find('#dependants-birthday-day-label-error-'+taxReturnId),
            monthLabelError = dependantsForm.find('#dependants-birthday-month-label-error-'+taxReturnId),
            yearLabelError = dependantsForm.find('#dependants-birthday-year-label-error-'+taxReturnId),
            relationshipLabelError = dependantsForm.find('#dependants-relationship-label-error-'+taxReturnId);

        firstName.removeClass(helpers.errorClass);
        lastName.removeClass(helpers.errorClass);
        day.removeClass(helpers.errorClass);
        month.removeClass(helpers.errorClass);
        year.removeClass(helpers.errorClass);
        relationship.removeClass(helpers.errorClass);

        firstNameLabelError.removeClass(helpers.errorClass);
        lastNameLabelError.removeClass(helpers.errorClass);
        dayLabelError.removeClass(helpers.errorClass);
        monthLabelError.removeClass(helpers.errorClass);
        yearLabelError.removeClass(helpers.errorClass);
        relationshipLabelError.removeClass(helpers.errorClass);

        //firstName
        if (helpers.isEmpty(firstName.val())){
            firstName.addClass(helpers.errorClass);
            firstNameLabelError.addClass(helpers.errorClass);
            errors++;
        }
        //lastName
        if (helpers.isEmpty(lastName.val())){
            lastName.addClass(helpers.errorClass);
            lastNameLabelError.addClass(helpers.errorClass);
            errors++;
        }
        //day
        if (helpers.isEmpty(day.val())){
            day.addClass(helpers.errorClass);
            dayLabelError.addClass(helpers.errorClass);
            errors++;
        }
        //month
        if (helpers.isEmpty(month.val())){
            month.addClass(helpers.errorClass);
            monthLabelError.addClass(helpers.errorClass);
            errors++;
        }
        //year
        if (helpers.isEmpty(year.val())){
            year.addClass(helpers.errorClass);
            yearLabelError.addClass(helpers.errorClass);
            errors++;
        }
        //relationship
        if (helpers.isEmpty(relationship.val())){
            relationship.addClass(helpers.errorClass);
            relationshipLabelError.addClass(helpers.errorClass);
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
                //if 'yes' is selected
                entry.hasDependants = formData[entry.id][9201];//todo, find better way of linking model id
            } catch(exception){
//do nothing
            }
        });
        personalProfile.refreshPage(accountSession);
    }

    this.init = function(){
        if ($('#personal-profile-dependants').length > 0) {
            //variables
            dependantsSubmit = $('#dependants-submit');
            dependantsForm = $('#dependants-form');
            dependantsBack = $('#dependants-back');

            //listeners
            dependantsBack.on('click',function(event){
                event.preventDefault();
                goToPreviousScreen();
            });

            dependantsForm.on('submit',function(event){
                event.preventDefault();
                submitDependants();
            });

            dependantsSubmit.on('click',function(event){
                event.preventDefault();
                submitDependants();
            });


            var formData = helpers.getTileFormDataArray(dependantsForm);

            _.each(formData, function(taxReturn){
                var hasDependants = $('#has-dependants-' + taxReturn.taxReturnId);
                var noDependants = $('#no-dependants-' + taxReturn.taxReturnId);
                var dependantsSave = $('#dependants-save-'+taxReturn.taxReturnId);
                var dependantsLine = $('#container-dependants-line-' + taxReturn.taxReturnId);
                var dependantsContainerLine = $('#dependant-name-list-'+taxReturn.taxReturnId);
                var dependantsContainerLine2 = $('#dependant-date-list-'+taxReturn.taxReturnId);
                var dependantsContainerLine3 = $('#dependant-delete-list-'+taxReturn.taxReturnId);
                var dependantsContainerLine4 = $('#dependant-edit-list-'+taxReturn.taxReturnId);
                var firstName = $('#dependants-first-name-'+taxReturn.taxReturnId);
                var lastName = $('#dependants-last-name-'+taxReturn.taxReturnId);
                var add = $('.i--icon-add');
                var day = $('#dependants-birthday-day-'+taxReturn.taxReturnId);
                var month = $('#dependants-birthday-month-'+taxReturn.taxReturnId);
                var year = $('#dependants-birthday-year-'+taxReturn.taxReturnId);
                var dependantsContainer = $('#container-dependants-form-'+taxReturn.taxReturnId);
                var dependantsEdit = $('#dependants-edit-'+taxReturn.taxReturnId);
                var dependantsDelete = $('#dependants-delete-'+taxReturn.taxReturnId);

                //overwrite standard tile selector active toggle
                $(document).off('click', '.'+helpers.tileClass);

                //listeners

                dependantsEdit.on('click',function(event){
                    event.preventDefault();
                    //TODO: Edit dependant function
                });

                dependantsDelete.on('click',function(event){
                    event.preventDefault();
                    dependantsContainerLine.remove();
                    dependantsContainerLine2.remove();
                });

                hasDependants.on('click', function(event){
                    event.preventDefault();
                    $(this).toggleClass(activeClass);
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
                        dependantsContainerLine3.append('</br><button id="dependants-delete-'+taxReturn.taxReturnId+'" class="green-outline">Delete</button>');
                        dependantsContainerLine4.append('</br><button id="dependants-edit-'+taxReturn.taxReturnId+'" class="green-outline">Edit</button>');
                    }
                });

                noDependants.on('click', function(event){
                    event.preventDefault();
                    $(this).toggleClass(activeClass);
                    hasDependants.removeClass(activeClass);
                    dependantsContainer.hide();
                    dependantsLine.hide();
                });
            });

        }
    };

}).apply(app.views.personalProfile.dependants);
