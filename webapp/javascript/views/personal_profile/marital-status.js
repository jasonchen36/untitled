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
        birthDayErrorLabel,
        birthMonthErrorLabel,
        birthDay,
        birthMonth,
        errorClass = app.helpers.errorClass,
        activeClass = app.helpers.activeClass,
        disabledClass = app.helpers.disabledClass;

    function submitMaritalStatus(){
        $('.'+helpers.formContainerClass).each(function(){
            validateMonthDayForm($(this));
        });
        if (!maritalStatusSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormDataArray(maritalStatusForm);
            var sessionData = personalProfile.getPersonalProfileSession();
            var accountInfo = helpers.getAccountInformation(sessionData);

            if(!helpers.hasSelectedTile(formData)){
                window.location.hash = 'modal-personal-profile-popup';
            }else if ( helpers.hasMultipleSelectedTiles(formData)){
            } else {
                maritalStatusSubmit.addClass(disabledClass);
               /* ajax.ajax(
                    'POST',
                    '/personal-profile',
                    {
                        action: 'api-pp-marital-status',
                        data: formData
                    },
                    'json',
                    { }
                )
                    .then(function(response){
                        personalProfile.goToNextPage(response.data);
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                        maritalStatusSubmit.removeClass(disabledClass);
                    });*/

                return Promise.resolve()
                    .then(function() {
                        var promiseArrayPut = [];
                        var promiseArrayGet = [];
                        var promiseArrayQuestions = [];

                        //todo, product and question category in variable
                        var ajaxAnswers = apiservice.getQuestions(sessionData,9);
                        promiseArrayQuestions.push(ajaxAnswers);



                        _.each(formData, function(entry) {

                            //todo,
                            /*var ajaxOne =  apiservice.postAnswers(sessionData,
                                entry.taxReturnId, entry);
                            promiseArrayPut.push(ajaxOne);*/

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
                        maritalStatusSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    function validateMonthDayForm(maritalStatusForm){
        var taxReturnId = maritalStatusForm.attr('data-id'),
            birthDayErrorLabel = maritalStatusForm.find('#birth-day-error-label-' + taxReturnId),
            birthMonthErrorLabel = maritalStatusForm.find('#birth-month-error-label-' + taxReturnId),
            birthDay = maritalStatusForm.find('#birth-day-' + taxReturnId),
            birthMonth = maritalStatusForm.find('#birth-month-' + taxReturnId);

            birthDay.removeClass(helpers.errorClass);
            birthDayErrorLabel.removeClass(helpers.errorClass);
            birthMonth.removeClass(helpers.errorClass);
            birthMonthErrorLabel.removeClass(helpers.errorClass);

        if (helpers.isEmpty(birthDay.val())){
            birthDay.addClass(helpers.errorClass);
            birthDayErrorLabel.addClass(helpers.errorClass);
        }
        if (helpers.isEmpty(birthMonth.val())){
            birthMonth.addClass(helpers.errorClass);
            birthMonthErrorLabel.addClass(helpers.errorClass);
        }
    }

    function updateMaritalStatus(){
        if (!maritalStatusSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormDataArray(maritalStatusForm);
            var sessionData = personalProfile.getPersonalProfileSession();
            var accountInfo = helpers.getAccountInformation(sessionData);
            var nameData = helpers.getFormDataArray(maritalStatusForm);
            nameData = nameData[0];
                maritalStatusSubmit.addClass(disabledClass);
               /* ajax.ajax(
                    'POST',
                    '/personal-profile',
                    {
                        action: 'api-pp-marital-status',
                        data: formData
                    },
                    'json',
                    { }
                )
                    .then(function(response){
                        personalProfile.goToNextPage(response.data);
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                        maritalStatusSubmit.removeClass(disabledClass);
                    });*/

                return Promise.resolve()
                    .then(function() {
                        var promiseArrayPut = [];
                        var promiseArrayGet = [];
                        var promiseArrayQuestions = [];

                        //todo, product and question category in variable
                        var ajaxAnswers = apiservice.getQuestions(sessionData,5);
                        promiseArrayQuestions.push(ajaxAnswers);



                        _.each(formData, function(entry) {

                            //todo,
                            /*var ajaxOne =  apiservice.postAnswers(sessionData,
                                entry.taxReturnId, entry);
                            promiseArrayPut.push(ajaxOne);*/

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

    this.init = function(){
        if ($('#personal-profile-marital-status').length > 0) {

            //variables
            maritalStatusForm = $('#marital-status-form');
            maritalStatusSubmit = $('#marital-status-submit');
            maritalStatusBack = $('#marital-status-back');

            var formData = helpers.getTileFormDataArray(maritalStatusForm);

            _.each(formData, function(taxReturn){
                var checkbox = $('#marital-status-changed-' + taxReturn.taxReturnId);
                var day = $('#birth-day-' + taxReturn.taxReturnId);
                var month = $('#birth-month-' + taxReturn.taxReturnId);

                var marriedChoice = $('#married-married');
                var divorcedChoice = $('#married-divorced');
                var separatedChoice = $('#married-separated');
                var widowedChoice = $('#married-widowed');
                var commonlawChoice = $('#married-common-law');
                var singleChoice = $('#married-single');

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
                    $(this).toggleClass(helpers.activeClass);
                    day.toggle();
                    month.toggle();
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
