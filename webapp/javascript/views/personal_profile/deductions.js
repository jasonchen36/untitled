(function(){

    var $ = jQuery,
        that = app.views.personalProfile.deductions,
        helpers = app.helpers,
        apiservice = app.apiservice,
        ajax = app.ajax,
        personalProfile = app.services.personalProfile,
        deductionsForm,
        deductionsSubmit,
        deductionsBack,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitDeductions(){
        if (!deductionsSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormDataArray(deductionsForm);
            var sessionData = personalProfile.getPersonalProfileSession();
            var accountInfo = helpers.getAccountInformation(sessionData);

            if (!helpers.hasSelectedTile(formData)) {
                //todo, real alert
                alert('no selected option');
            } else if(helpers.noneAppliedMultipleSelectedTiles(formData)){
                //todo, real alert
                alert('cannot select None Apply with other options');
            } else {
              return Promise.resolve()
                    .then(function() {
                        var promiseArrayPut = [];
                        var promiseArrayGet = [];
                        var promiseArrayQuestions = [];

                        var ajaxAnswers = apiservice.getQuestions(sessionData,5);

                        promiseArrayQuestions.push(ajaxAnswers);

                        _.each(formData, function(entry) {

                            var ajaxOne = apiservice.postAnswers(sessionData,
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
                        deductionsSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    function updateDeductions(){
        if (!deductionsSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormDataArray(deductionsForm);
            var sessionData = personalProfile.getPersonalProfileSession();
            var accountInfo = helpers.getAccountInformation(sessionData);

              return Promise.resolve()
                    .then(function() {
                        var promiseArrayPut = [];
                        var promiseArrayGet = [];
                        var promiseArrayQuestions = [];

                        var ajaxAnswers = apiservice.getQuestions(sessionData,5);

                        promiseArrayQuestions.push(ajaxAnswers);

                        _.each(formData, function(entry) {

                            var ajaxOne = apiservice.postAnswers(sessionData,
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
                        deductionsSubmit.removeClass(disabledClass);
                    });

        }
    }

    this.init = function(){
        if ($('#personal-profile-deductions').length > 0) {

            //variables
            deductionsForm = $('#deductions-form');
            deductionsSubmit = $('#deductions-submit');
            deductionsBack = $('#deductions-back');

            //listeners
            deductionsForm.on('submit',function(event){
               event.preventDefault();
               submitDeductions();
            });

            deductionsSubmit.on('click',function(event){
                event.preventDefault();
                submitDeductions();
            });

            deductionsBack.on('click',function(event){
                event.preventDefault();
                updateDeductions();
            });
        }
    };

}).apply(app.views.personalProfile.deductions);
