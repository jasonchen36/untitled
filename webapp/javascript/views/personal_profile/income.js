(function(){

    var $ = jQuery,
        that = app.views.personalProfile.income,
        helpers = app.helpers,
        ajax = app.ajax,
        personalProfile = app.services.personalProfile,
        incomeForm,
        incomeSubmit,
        incomeBack,
        activeClass = helpers.activeClass,
        errorClass = helpers.errorClass,
        disabledClass = helpers.disabledClass;

    function submitIncome(){
        if (!incomeSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormDataArray(incomeForm);
         
            var sessionData = personalProfile.getPersonalProfileSession();
            var accountInfo = helpers.getAccountInformation(sessionData);


            if(!helpers.hasSelectedTile(formData)){
                //todo, real alert
                window.location.hash = 'modal-personal-profile-popup';
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
                        var promiseArrayTaxReturns = [];

                        //todo, product and question category in variable
                        var uri = sessionData.apiUrl + '/questions/product/' + sessionData.productId + '/category/' + 2;

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
                            uri = sessionData.apiUrl + '/tax_return/' + entry.taxReturnId + '/answers/category/' + 2;

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

                            uri = sessionData.apiUrl + '/tax_return/' + entry.taxReturnId;
                            var ajaxTaxReturns =ajax.ajax(
                                'GET',
                                uri,
                                {
                                },
                                'json',
                                {
                                    'Authorization': 'Bearer '+ accountInfo.token
                                }
                            );

                            promiseArrayTaxReturns.push(ajaxTaxReturns);
                            promiseArrayGet.push(ajaxTwo);  
                        });  

                      return Promise.all([Promise.all(promiseArrayPut),
                            Promise.all(promiseArrayGet),
                            Promise.all(promiseArrayQuestions),
                            Promise.all(promiseArrayTaxReturns)]);

                    })
                    .then(function(response) {


         
                        var data = {};
                        data.accountInfo = accountInfo;
                        data.taxReturns = response[3];
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
                personalProfile.goToPreviousPage();
            });
        }
    };

}).apply(app.views.personalProfile.income);