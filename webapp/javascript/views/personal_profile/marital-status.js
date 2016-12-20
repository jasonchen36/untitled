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
        disabledClass = app.helpers.disabledClass;

    function submitMaritalStatus(){
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
