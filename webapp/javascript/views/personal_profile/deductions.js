(function(){

    var $ = jQuery,
        that = app.views.personalProfile.deductions,
        helpers = app.helpers,
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

                        //todo, question category in variable
                        var uri = sessionData.apiUrl + '/questions/product/' + sessionData.productId + '/category/' + 5;

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
                            uri = sessionData.apiUrl + '/tax_return/' + entry.taxReturnId + '/answers/category/' + 5;

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
                        data.taxReturns.answers = response[1];
                        data.taxReturns.questions = response[2];  

                        var index = 0;
                        _.each(data.taxReturns, function(taxReturn){

                            taxReturn.answers = response[1][index];
                            taxReturn.questions = response[2][0]; 
                            index++;
                        });  

                        personalProfile.goToNextPage(data);
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                        incomeSubmit.removeClass(disabledClass);
                    });
            }
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
                personalProfile.goToPreviousPage();
            });
        }
    };

}).apply(app.views.personalProfile.deductions);