(function(){

    var $ = jQuery,
        that = app.views.personalProfile.specialScenarios,
        helpers = app.helpers,
        ajax = app.ajax,
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
                window.location.hash = 'modal-personal-profile-popup-none-apply';
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
                        specialScenariosSubmit.removeClass(disabledClass);
                    });
            }
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
                personalProfile.goToPreviousPage();
            });
        }
    };

}).apply(app.views.personalProfile.specialScenarios);
