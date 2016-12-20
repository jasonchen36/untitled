(function(){

    var $ = jQuery,
        that = app.views.personalProfile.credits,
        helpers = app.helpers,
        apiservice = app.apiservice,
        ajax = app.ajax,
        personalProfile = app.services.personalProfile,
        creditsForm,
        creditsSubmit,
        creditsBack,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitCredits(){
        if (!creditsSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormDataArray(creditsForm);
            var sessionData = personalProfile.getPersonalProfileSession();
            var accountInfo = helpers.getAccountInformation(sessionData);

            if(!helpers.hasSelectedTile(formData)){
                window.location.hash = 'modal-personal-profile-popup';
            }else if(helpers.noneAppliedMultipleSelectedTiles(formData)) {
            } else {
              return Promise.resolve()
                    .then(function() {
                        var promiseArrayPut = [];
                        var promiseArrayGet = [];
                        var promiseArrayQuestions = [];

                        var ajaxAnswers = apiservice.getQuestions(sessionData,3);
                        promiseArrayQuestions.push(ajaxAnswers);

                        _.each(formData, function(entry) {

                            var ajaxOne = apiservice.postAnswers(sessionData,
                                                 entry.taxReturnId, entry);

                            promiseArrayPut.push(ajaxOne);

                            var ajaxTwo = apiservice.getAnswers(sessionData,
                                                    entry.taxReturnId,3);

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
                        creditsSubmit.removeClass(disabledClass);
                    });


            }
        }
    }

    function updateCredits(){
        if (!creditsSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormDataArray(creditsForm);
            var sessionData = personalProfile.getPersonalProfileSession();
            var accountInfo = helpers.getAccountInformation(sessionData);


              return Promise.resolve()
                    .then(function() {
                        var promiseArrayPut = [];
                        var promiseArrayGet = [];
                        var promiseArrayQuestions = [];

                        var ajaxAnswers = apiservice.getQuestions(sessionData,1);
                        promiseArrayQuestions.push(ajaxAnswers);

                        _.each(formData, function(entry) {

                            var ajaxOne = apiservice.postAnswers(sessionData,
                                                 entry.taxReturnId, entry);

                            promiseArrayPut.push(ajaxOne);

                            var ajaxTwo = apiservice.getAnswers(sessionData,
                                                    entry.taxReturnId,1);

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
                        creditsSubmit.removeClass(disabledClass);
                    });



        }
    }

    this.init = function(){
        if ($('#personal-profile-credits').length > 0) {

            //variables
            creditsForm = $('#credits-form');
            creditsSubmit = $('#credits-submit');
            creditsBack = $('#credits-back');

            //listeners
            creditsForm.on('submit',function(event){
                event.preventDefault();
                submitCredits();
            });

            creditsSubmit.on('click',function(event){
                event.preventDefault();
                submitCredits();
            });

            creditsBack.on('click',function(event){
                event.preventDefault();
                updateCredits();
            });
        }
    };

}).apply(app.views.personalProfile.credits);
