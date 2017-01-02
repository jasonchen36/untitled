(function(){

    var $ = jQuery,
        that = app.views.personalProfile.specialScenarios,
        helpers = app.helpers,
        ajax = app.ajax,
        apiService = app.apiservice,
        personalProfile = app.services.personalProfile,
        specialScenariosForm,
        specialScenariosSubmit,
        specialScenariosBack,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitSpecialScenarios(){

        if (!specialScenariosSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormDataArray(specialScenariosForm);
            var sessionData = personalProfile.getPersonalProfileSession();
            var accountInfo = helpers.getAccountInformation(sessionData);

            if(!helpers.hasSelectedTile(formData)){
                window.location.hash = 'modal-personal-profile-popup';
            } else if(helpers.noneAppliedMultipleSelectedTiles(formData)){
            } else {
                 return Promise.resolve()
                    .then(function() {
                        var promiseArrayPut = [];
                        var promiseArrayGet = [];
                        var promiseArrayQuestions = [];

                        //todo, question category in variable
                        var uri = sessionData.apiUrl+ '/questions/product/' + sessionData.productId + '/category/' + 8;

                        var ajaxAnswers = ajax.ajax(
                            'GET',
                            uri,
                            {
                            },
                            'json',
                           {
                                  'Authorization': 'Bearer '+ accountInfo.token
                           }
                        );

                        promiseArrayQuestions.push(ajaxAnswers);

                        _.each(formData, function(entry) {

                            var answerKeys = Object.keys(entry);
                            var answers = [];
                            var answerIndex = 0;

                            _.each(entry, function(answer) {

                                    var text= '';

                                if(answer === 1){
                                    text = 'Yes';
                                } else if (answer === 0){
                                    text = 'No';
                                }

                                if(text.length > 1) {

                                    answers.push(
                                           {
                                               questionId: answerKeys[answerIndex],
                                               text: text
                                           });
                                }
                                answerIndex++;
                            });


                            var uri = sessionData.apiUrl + '/tax_return/' + entry.taxReturnId + '/answers/';

                            var ajaxOne = ajax.ajax(
                                   'POST',
                                    uri,
                                    {
                                        'answers': answers
                                    },
                                   'json-text',
                                    {
                                      'Authorization': 'Bearer '+ accountInfo.token
                                    }

                                );
                              promiseArrayPut.push(ajaxOne);



                            //todo, update with new API route to get tax return with questions and answers in one object
                            uri = sessionData.apiUrl + '/tax_return/' + entry.taxReturnId + '/answers/category/' + 8;

                            var ajaxTwo = ajax.ajax(
                                'GET',
                                uri,
                                {
                                },
                                'json',
                                 {
                                  'Authorization': 'Bearer '+ accountInfo.token
                                 }
                            );

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
                            taxReturn.questions = response[1][index];
                            taxReturn.firstName = nameData[index];
                            taxReturn.accountInfo = accountInfo;
                            taxReturn.accountInfo.firstName = accountInfo.firstName.toUpperCase();
                            _.each(taxReturn.questions.answers, function(answer){
                                answer.tiles = apiService.getMarriageTiles(taxReturn.taxReturnId, answer.text);
                                answer.answer = 0;
                                answer.class = "";
                                if (!answer.text) {
                                    answer.answer = 0;
                                    answer.class = "";
                                } else if (answer.text === "Yes"){
                                    answer.answer = 1;
                                    answer.class = helpers.activeClass;
                                }
                            });
                            index++;

                        });
                        personalProfile.goToNextPage(data);
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                        specialScenariosSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    function updateSpecialScenarios(){

        if (!specialScenariosSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormDataArray(specialScenariosForm);
            var sessionData = personalProfile.getPersonalProfileSession();
            var accountInfo = helpers.getAccountInformation(sessionData);

                 return Promise.resolve()
                    .then(function() {
                        var promiseArrayPut = [];
                        var promiseArrayGet = [];
                        var promiseArrayQuestions = [];

                        //todo, question category in variable
                        var uri = sessionData.apiUrl+ '/questions/product/' + sessionData.productId + '/category/' + 3;

                        var ajaxAnswers = ajax.ajax(
                            'GET',
                            uri,
                            {
                            },
                            'json',
                           {
                                  'Authorization': 'Bearer '+ accountInfo.token
                           }
                        );

                        promiseArrayQuestions.push(ajaxAnswers);

                        _.each(formData, function(entry) {

                            var answerKeys = Object.keys(entry);
                            var answers = [];
                            var answerIndex = 0;

                            _.each(entry, function(answer) {

                                    var text= '';

                                if(answer === 1){
                                    text = 'Yes';
                                } else if (answer === 0){
                                    text = 'No';
                                }

                                if(text.length > 1) {

                                    answers.push(
                                           {
                                               questionId: answerKeys[answerIndex],
                                               text: text
                                           });
                                }
                                answerIndex++;


                            });


                            var uri = sessionData.apiUrl + '/tax_return/' + entry.taxReturnId + '/answers/';

                            var ajaxOne = ajax.ajax(
                                   'POST',
                                    uri,
                                    {
                                        'answers': answers
                                    },
                                   'json-text',
                                    {
                                      'Authorization': 'Bearer '+ accountInfo.token
                                    }

                                );
                              promiseArrayPut.push(ajaxOne);



                            //todo, update with new API route to get tax return with questions and answers in one object
                            uri = sessionData.apiUrl + '/tax_return/' + entry.taxReturnId + '/answers/category/' + 3;

                            var ajaxTwo = ajax.ajax(
                                'GET',
                                uri,
                                {
                                },
                                'json',
                                 {
                                  'Authorization': 'Bearer '+ accountInfo.token
                                 }
                            );

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
                            taxReturn.questions = response[1][index];
                            taxReturn.firstName = nameData[index];
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
                        specialScenariosSubmit.removeClass(disabledClass);
                    });

        }
    }

    this.init = function(){
        if ($('#personal-profile-special-scenarios').length > 0) {

            //variables
            specialScenariosForm = $('#special-scenarios-form');
            specialScenariosSubmit = $('#special-scenarios-submit');
            specialScenariosBack = $('#special-scenarios-back');



            //listeners
            specialScenariosForm.on('submit',function(event){
                event.preventDefault();
                submitSpecialScenarios();
            });

            specialScenariosSubmit.on('click',function(event){
                event.preventDefault();
                submitSpecialScenarios();
            });

            specialScenariosBack.on('click',function(event){
                event.preventDefault();
                updateSpecialScenarios();
            });
        }
    };

}).apply(app.views.personalProfile.specialScenarios);
