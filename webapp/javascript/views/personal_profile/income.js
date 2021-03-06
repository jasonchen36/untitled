(function(){

    var $ = jQuery,
        that = app.views.personalProfile.income,
        helpers = app.helpers,
        apiservice = app.apiservice,
        personalProfile = app.services.personalProfile,
        ajax = app.ajax,
        incomeForm,
        incomeSubmit,
        incomeBack,
        activeClass = helpers.activeClass,
        errorClass = helpers.errorClass,
        disabledClass = helpers.disabledClass;

    function submitIncome(){
        if (!incomeSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormDataArray(incomeForm);
            nameData = helpers.getFormDataArray(incomeForm);
            nameData = nameData[0];
            var sessionData = personalProfile.getPersonalProfileSession();
            var accountInfo = helpers.getAccountInformation(sessionData);
            var tileCount = 0;
            for (index = 0; index < formData.length; index++) {
                  for (var key in formData[index]) {
                  if (formData[index].hasOwnProperty(key)) {
                    if (formData[index][key] === 1){
                      tileCount++;
                    }
                  }
                }
              if (tileCount > index) {
                selectedTile = true;
              } else {
                selectedTile = false;
                break;
              }
            }
            if (selectedTile === true) {
                return Promise.resolve()
                    .then(function() {
                        var promiseArrayPut = [];
                        var promiseArrayGet = [];
                        var promiseArrayQuestions = [];

                        //todo, product and question category in variable
                        var ajaxAnswers = apiservice.getQuestions(sessionData,2);
                        promiseArrayQuestions.push(ajaxAnswers);

                        _.each(formData, function(entry) {

                            var ajaxOne =  apiservice.postAnswers(sessionData,
                                                 entry.taxReturnId, entry);
                            promiseArrayPut.push(ajaxOne);

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
                        incomeSubmit.removeClass(disabledClass);
                    });
            } else {
              window.location.hash = 'modal-personal-profile-popup';
            }
        }
    }

    function updateIncome(){
        if (!incomeSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormDataArray(incomeForm);
            nameData = helpers.getFormDataArray(incomeForm);
            nameData = nameData[0];
            var sessionData = personalProfile.getPersonalProfileSession();
            var accountInfo = helpers.getAccountInformation(sessionData);
            if(!helpers.hasSelectedTile(formData)){
                window.location.hash = 'modal-personal-profile-popup';
            } else {
                return Promise.resolve()
                    .then(function() {
                        var promiseArrayPut = [];
                        var promiseArrayGet = [];
                        var promiseArrayQuestions = [];
                        var promiseArrayCategory = [];

                        var formData = helpers.getTileFormDataArray(incomeForm);

                        var ajaxCategory = apiservice.getCategoryById(sessionData, 11);
                        promiseArrayCategory.push(ajaxCategory);

                        _.each(formData, function(taxReturn){
                        var ajaxAnswers = apiservice.getTaxReturnLastName(sessionData,taxReturn.taxReturnId);
                        promiseArrayQuestions.push(ajaxAnswers);
                        });

                        _.each(formData, function(entry) {

                            var ajaxOne =  apiservice.postAnswers(sessionData,
                                                 entry.taxReturnId, entry);
                            promiseArrayPut.push(ajaxOne);

                            var ajaxTwo = apiservice.getAnswers(sessionData,
                                                    entry.taxReturnId,2);

                            promiseArrayGet.push(ajaxTwo);
                        });

                      return Promise.all([Promise.all(promiseArrayPut),
                            Promise.all(promiseArrayGet),
                            Promise.all(promiseArrayQuestions),
                            Promise.all(promiseArrayCategory)]);

                    })
                    .then(function(response) {
                        var data = {};
                        data.accountInfo = accountInfo;
                        data.taxReturns = formData;
                        data.taxReturns.questions = response[2];
                        data.taxReturns.category = response[3];
                        var index = 0;
                        _.each(data.taxReturns, function(taxReturn){
                            taxReturn.questions = response[1][index];
                            taxReturn.firstName = nameData[index];
                            taxReturn.lastName = data.taxReturns.questions[index].last_name;
                            taxReturn.middleInitial = data.taxReturns.questions[index].middle_initial;
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
                        incomeSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    this.init = function(){
        if ($('#personal-profile-income').length > 0) {

            //variables
            incomeForm = $('#income-form');
            incomeSubmit = $('#income-submit');
            incomeBack = $('#income-back');

            //listeners
            incomeForm.on('submit',function(event){
                event.preventDefault();
                submitIncome();
            });

            incomeSubmit.on('click',function(event){
                event.preventDefault();
                submitIncome();
            });

            incomeBack.on('click',function(event){
                event.preventDefault();
                updateIncome();
            });

            $(document).ready(function(){
                $(this).scrollTop(0);
            });
        }
    };

}).apply(app.views.personalProfile.income);
