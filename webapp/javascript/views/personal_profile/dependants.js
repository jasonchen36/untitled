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
        dependantsTiles,
        dependantsEditButtons,
        dependantsDeleteButtons,
        dependantsAddButtons,
        dependantsSaveButtons,
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
                        var promiseSaveAnswers = updateTileAnswers(formData),
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

    function updateTileAnswers(formData){
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
    }

    function goToPreviousScreen(){
        if (!dependantsSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormDataArray(dependantsForm),
                sessionData = personalProfile.getPersonalProfileSession(),
                accountInfo = helpers.getAccountInformation(sessionData),
                previousScreenCategoryId = 8;
            dependantsSubmit.addClass(disabledClass);
            return Promise.resolve()
                .then(function() {
                    var promiseSaveAnswers = updateTileAnswers(formData),
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

    function updateUserDependants(selectedTile){
        var pageData = personalProfile.getPageSession(),
            tileId = parseInt(selectedTile.attr('id'));
        //enforce toggle
        if(selectedTile.hasClass(activeClass)){
            //deselect option
            _.each(pageData.taxReturns, function(taxReturn){
                _.each(taxReturn.questions.answers, function(answer){
                    if(answer.id === tileId){
                        answer.class = '';
                    }
                    return answer;
                });
            });
        } else {
            //select option
            var hasSelectedTile;
            _.each(pageData.taxReturns, function(taxReturn){
                hasSelectedTile = false;
                _.each(taxReturn.questions.answers, function(answer){
                    if(answer.id === tileId){
                        answer.class = activeClass;
                        hasSelectedTile = true;
                    }
                    return answer;
                });
                if (hasSelectedTile){
                    //deselect siblings
                    _.each(taxReturn.questions.answers, function(answer){
                        if(answer.id !== tileId){
                            answer.class = '';
                        }
                        return answer;
                    });
                }
            });
        }
        //refresh page
        personalProfile.refreshPage(pageData);
    }

    function editDependant(element){
        var dependentId = parseInt(element.attr('data-id'));
        console.log('edit dependant '+dependentId);
    }

    function saveDependant(element){
        console.log('save dependant');
    }

    function deleteDependant(element){
        if (!element.hasClass(helpers.disabledClass)){
            element.addClass(helpers.disabledClass);
            var dependantId = parseInt(element.attr('data-id')),
                taxReturnId = parseInt(element.attr('data-tax-return-id')),
                sessionData = personalProfile.getPersonalProfileSession(),
                pageData = personalProfile.getPageSession();
            apiService.deleteDependantById(sessionData, taxReturnId, dependantId)
                .then(function(){
                    //get updated dependants information
                    var promiseGetDependants = [];
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
                })
                .catch(function(jqXHR,textStatus,errorThrown){
                    ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                    element.removeClass(helpers.disabledClass);
                });
        }
    }

    function addDependant(element){
        var pageData = personalProfile.getPageSession(),
            taxReturnId = parseInt(element.attr('data-tax-return-id'));
        _.each(pageData.taxReturns, function(taxReturn){
            if (parseInt(taxReturn.taxReturnId) === taxReturnId){
                taxReturn.dependantForm = {};
            }
        });
        personalProfile.refreshPage(pageData);
    }

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

            dependantsTiles.on('click',function(event){
                event.preventDefault();
                updateUserDependants($(this));
            });

            dependantsEditButtons.on('click',function(event){
                event.preventDefault();
                editDependant($(this));
            });

            dependantsDeleteButtons.on('click',function(event){
                event.preventDefault();
                deleteDependant($(this));
            });

            dependantsAddButtons.on('click',function(event){
                event.preventDefault();
                addDependant($(this));
            });

            dependantsSaveButtons.on('click',function(event){
                event.preventDefault();
                saveDependant($(this));
            });

        }
    };

}).apply(app.views.personalProfile.dependants);
