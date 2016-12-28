(function(){

    var $ = jQuery,
        that = app.views.personalProfile.maritalStatus,
        helpers = app.helpers,
        ajax = app.ajax,
        apiservice = app.apiservice,
        personalProfile = app.services.personalProfile,
        maritalStatusForm,
        maritalStatusSubmit,
        maritalStatusBack,
        errorClass = app.helpers.errorClass,
        activeClass = app.helpers.activeClass,
        disabledClass = app.helpers.disabledClass;

    function submitMaritalStatus(){
        if (!maritalStatusSubmit.hasClass(disabledClass)) {
            var formData = helpers.getMaritalStatusFormDataArray(maritalStatusForm);
            var sessionData = personalProfile.getPersonalProfileSession();
            var accountInfo = helpers.getAccountInformation(sessionData);

            validateMaritalStatusFormData(maritalStatusForm);

            if(!validateMaritalStatusTiles(maritalStatusForm)){
                window.location.hash = 'modal-personal-profile-popup';
            } else if (!helpers.formHasErrors(maritalStatusForm)) {
                maritalStatusSubmit.addClass(disabledClass);

                return Promise.resolve()
                    .then(function() {
                        var promiseArrayPut = [];
                        var promiseArrayGet = [];
                        var promiseArrayQuestions = [];

                        //todo, product and question category in variable
                        var ajaxAnswers = apiservice.getQuestions(sessionData,9);
                        promiseArrayQuestions.push(ajaxAnswers);

                        _.each(formData, function(entry) {

                            var ajaxOne =  apiservice.postMaritalAnswers(sessionData,
                                entry.taxReturnId, entry);
                            promiseArrayPut.push(ajaxOne);

                            // if status changed update date
                            if(entry[149] === 1) {
                                entry.questionId = 150;
                                var day = maritalStatusForm.find('#marital-status-day-'+entry.taxReturnId);
                                var month = maritalStatusForm.find('#marital-status-month-'+entry.taxReturnId);
                                entry.answer = day + '/' + month;
                                ajaxOne =  apiservice.postMaritalDate(sessionData,
                                    entry.taxReturnId, entry);
                                promiseArrayPut.push(ajaxOne);
                            }

                            var ajaxTwo = apiservice.getAnswers(sessionData,
                                entry.taxReturnId,9);

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
                            var questionIndex = 0;
                            taxReturn.firstName = nameData[index];
                            taxReturn.questions = response[1][index];
                            _.each(taxReturn.questions.answers, function(question){
                              question.answer = 0;
                              question.class = "";

                                if(questionIndex===0){
                                    question.id="has-dependants-"+taxReturn.taxReturnId;
                                }else{
                                    question.id="no-dependants-"+taxReturn.taxReturnId;
                                }
                                questionIndex++;

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
                        maritalStatusSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    function updateMaritalStatus(){
        if (!maritalStatusSubmit.hasClass(disabledClass)) {
            var formData = helpers.getMaritalStatusFormDataArray(maritalStatusForm);
            var sessionData = personalProfile.getPersonalProfileSession();
            var accountInfo = helpers.getAccountInformation(sessionData);
            var nameData = helpers.getFormDataArray(maritalStatusForm);
            nameData = nameData[0];
                maritalStatusSubmit.addClass(disabledClass);

                return Promise.resolve()
                    .then(function() {
                        var promiseArrayPut = [];
                        var promiseArrayGet = [];
                        var promiseArrayQuestions = [];

                        //todo, product and question category in variable
                        var ajaxAnswers = apiservice.getQuestions(sessionData,5);
                        promiseArrayQuestions.push(ajaxAnswers);

                        _.each(formData, function(entry) {
                 
                            var ajaxOne =  apiservice.postAnswers(sessionData,
                                entry.taxReturnId, entry);
                            promiseArrayPut.push(ajaxOne);

                            var ajaxTwo = apiservice.getAnswers(sessionData,
                                entry.taxReturnId,5);

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

                        personalProfile.goToPreviousPage(data);
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                        maritalStatusSubmit.removeClass(disabledClass);
                    });

        }
    }

    function validateMaritalStatusFormData(maritalStatusForm){
        var formData = helpers.getMaritalStatusFormDataArray(maritalStatusForm);
        var errors = 0;
        _.each(formData, function(taxReturn){
        var
            statusChanged = maritalStatusForm.find('#marital-status-changed-'+taxReturn.taxReturnId),
            day = maritalStatusForm.find('#marital-status-day-'+taxReturn.taxReturnId),
            month = maritalStatusForm.find('#marital-status-month-'+taxReturn.taxReturnId);


        statusChanged.removeClass(helpers.errorClass);
        day.removeClass(helpers.errorClass);
        month.removeClass(helpers.errorClass);

        // Is status Changed?
        if (statusChanged.hasClass(activeClass)){

            // day
            if(helpers.isEmpty(day.val()) || !helpers.isValidNumber(day.val())){
                day.addClass(helpers.errorClass);
                errors++;
            }

            // month
            if(helpers.isEmpty(month.val()) || !helpers.isValidNumber(month.val())){
                month.addClass(helpers.errorClass);
                errors++;
            }
        }
            });
    return errors < 1;

    }

    function validateMaritalStatusTiles(maritalStatusForm){
        var formData = helpers.getMaritalStatusFormDataArray(maritalStatusForm);
        var isValid = true;
        var numActive = 0;
        _.each(formData, function(taxReturn) {
            var
                married = maritalStatusForm.find('#married-married-' + taxReturn.taxReturnId),
                divorced = maritalStatusForm.find('#married-divorced-' + taxReturn.taxReturnId),
                separated = maritalStatusForm.find('#married-separated-' + taxReturn.taxReturnId),
                widowed = maritalStatusForm.find('#married-widowed-' + taxReturn.taxReturnId),
                commonLaw = maritalStatusForm.find('#married-common-law-' + taxReturn.taxReturnId),
                single = maritalStatusForm.find('#married-single-' + taxReturn.taxReturnId);

            if(married.hasClass(activeClass)){
                numActive++;
            } else if(divorced.hasClass(activeClass)){
                numActive++;
            } else if(separated.hasClass(activeClass)){
                numActive++;
            } else if(widowed.hasClass(activeClass)){
                numActive++;
            } else if(commonLaw.hasClass(activeClass)){
                numActive++;
            } else if(single.hasClass(activeClass)){
                numActive++;
            }else{
                isValid = false;
            }

        });

        return isValid;
    }

    this.init = function(){
        if ($('#personal-profile-marital-status').length > 0) {

            //variables
            maritalStatusForm = $('#marital-status-form');
            maritalStatusSubmit = $('#marital-status-submit');
            maritalStatusBack = $('#marital-status-back');

            var formData = helpers.getTileFormDataArray(maritalStatusForm);

            var index = 0;
            var firstReturnId = -1;
            _.each(formData, function(taxReturn) {
                if(firstReturnId === -1) {
                    firstReturnId = taxReturn.taxReturnId;
                }

                var checkbox = $('#marital-status-changed-' + taxReturn.taxReturnId);
                var day = $('#marital-status-day-' + taxReturn.taxReturnId);
                var month = $('#marital-status-month-' + taxReturn.taxReturnId);
                var sameStatus = $('#marital-status-same-' + taxReturn.taxReturnId);


                var marriedChoice = $('#married-married-' + taxReturn.taxReturnId);
                var divorcedChoice = $('#married-divorced-' + taxReturn.taxReturnId);
                var separatedChoice = $('#married-separated-' + taxReturn.taxReturnId);
                var widowedChoice = $('#married-widowed-' + taxReturn.taxReturnId);
                var commonlawChoice = $('#married-common-law-' + taxReturn.taxReturnId);
                var singleChoice = $('#married-single-' + taxReturn.taxReturnId);

                marriedChoice.on('click', function(event){
                    event.preventDefault();
                    divorcedChoice.removeClass(activeClass);
                    separatedChoice.removeClass(activeClass);
                    commonlawChoice.removeClass(activeClass);
                    widowedChoice.removeClass(activeClass);
                    singleChoice.removeClass(activeClass);
                });
                divorcedChoice.on('click', function(event){
                    event.preventDefault();
                    marriedChoice.removeClass(activeClass);
                    separatedChoice.removeClass(activeClass);
                    commonlawChoice.removeClass(activeClass);
                    widowedChoice.removeClass(activeClass);
                    singleChoice.removeClass(activeClass);
                });
                separatedChoice.on('click', function(event){
                    event.preventDefault();
                    divorcedChoice.removeClass(activeClass);
                    marriedChoice.removeClass(activeClass);
                    commonlawChoice.removeClass(activeClass);
                    widowedChoice.removeClass(activeClass);
                    singleChoice.removeClass(activeClass);
                });
                widowedChoice.on('click', function(event){
                    event.preventDefault();
                    divorcedChoice.removeClass(activeClass);
                    separatedChoice.removeClass(activeClass);
                    commonlawChoice.removeClass(activeClass);
                    marriedChoice.removeClass(activeClass);
                    singleChoice.removeClass(activeClass);
                });
                commonlawChoice.on('click', function(event){
                    event.preventDefault();
                    divorcedChoice.removeClass(activeClass);
                    separatedChoice.removeClass(activeClass);
                    marriedChoice.removeClass(activeClass);
                    widowedChoice.removeClass(activeClass);
                    singleChoice.removeClass(activeClass);
                });
                singleChoice.on('click', function(event){
                    event.preventDefault();
                    divorcedChoice.removeClass(activeClass);
                    separatedChoice.removeClass(activeClass);
                    commonlawChoice.removeClass(activeClass);
                    widowedChoice.removeClass(activeClass);
                    marriedChoice.removeClass(activeClass);
                });

                checkbox.on('click',function(event){
                    event.preventDefault();
                    var parentElement = $(this),
                        childElement = parentElement.find('.checkbox').first();
                    childElement.toggleClass(helpers.activeClass);
                    day.toggle();
                    month.toggle();
                });

                sameStatus.on('click', function (event) {
                    event.preventDefault();
                    var parentElement = $(this),
                        childElement = parentElement.find('.checkbox').first();
                    childElement.toggleClass(helpers.activeClass);
                    if(childElement.hasClass(activeClass)) {
                        if ($('#marital-status-changed-' + firstReturnId).hasClass(activeClass)) {
                            checkbox.find('.checkbox').first().addClass(activeClass);
                            day.show();
                            day.val($('#marital-status-day-' + firstReturnId).val());
                            month.show();
                            month.val($('#marital-status-month-' + firstReturnId).val());
                        }

                        if($('#married-married-' + firstReturnId).hasClass(activeClass)){
                            marriedChoice.addClass(activeClass);
                        }else{
                            marriedChoice.removeClass(activeClass);
                        }

                        if($('#married-divorced-' + firstReturnId).hasClass(activeClass)){
                            divorcedChoice.addClass(activeClass);
                        }else{
                            divorcedChoice.removeClass(activeClass);
                        }

                        if($('#married-separated-' + firstReturnId).hasClass(activeClass)){
                            separatedChoice.addClass(activeClass);
                        }else{
                            separatedChoice.removeClass(activeClass);
                        }

                        if($('#married-widowed-' + firstReturnId).hasClass(activeClass)){
                            widowedChoice.addClass(activeClass);
                        }else{
                            widowedChoice.removeClass(activeClass);
                        }

                        if($('#married-common-law-' + firstReturnId).hasClass(activeClass)){
                            commonlawChoice.addClass(activeClass);
                        }else{
                            commonlawChoice.removeClass(activeClass);
                        }

                        if($('#married-single-' + firstReturnId).hasClass(activeClass)){
                            singleChoice.addClass(activeClass);
                        }else{
                            singleChoice.removeClass(activeClass);
                        }

                    } else {
                        checkbox.find('.checkbox').first().removeClass(activeClass);
                        day.hide();
                        month.hide();
                        marriedChoice.removeClass(activeClass);
                        divorcedChoice.removeClass(activeClass);
                        separatedChoice.removeClass(activeClass);
                        widowedChoice.removeClass(activeClass);
                        commonlawChoice.removeClass(activeClass);
                        singleChoice.removeClass(activeClass);
                    }

                });

            });

            //listeners
            maritalStatusForm.on('submit',function(event){
                event.preventDefault();
                submitMaritalStatus();
            });

            maritalStatusSubmit.on('click',function(event){
                event.preventDefault();
                submitMaritalStatus();
            });

            maritalStatusBack.on('click',function(event){
                event.preventDefault();
                updateMaritalStatus();
            });


        }
    };

}).apply(app.views.personalProfile.maritalStatus);
