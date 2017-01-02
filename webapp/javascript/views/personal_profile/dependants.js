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
        dependantCheckboxes,
        activeClass = helpers.activeClass,
        disabledClass = helpers.disabledClass;

    function submitDependants(){
        if (!dependantsSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormDataArray(dependantsForm),
                sessionData = personalProfile.getPersonalProfileSession(),
                accountInfo = helpers.getAccountInformation(sessionData),
                nextScreenCategoryId = 2;
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

    function validateDependantsFormData(formContainer){
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
    }

    function saveDependant(element){
        if (!element.hasClass(helpers.disabledClass)){
            if(validateDependantsFormData(element.parent().parent())){
                //todo, connect share dependant logic
                // element.addClass(helpers.disabledClass);
                console.log('call api');
            }
        }
    }

    function shareDependant(element){
        //todo, share dependant logic
        element.find('.checkbox').first().toggleClass(helpers.activeClass);
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
            dependantCheckboxes = $('.checkbox-container');

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

            dependantCheckboxes.on('click',function(event){
                event.preventDefault();
                shareDependant($(this));
            });

        }
    };

}).apply(app.views.personalProfile.dependants);
