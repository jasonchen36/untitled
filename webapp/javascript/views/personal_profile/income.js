(function(){

    var $ = jQuery,
        that = app.views.personalProfile.income,
        helpers = app.helpers,
        apiservice = app.apiservice, 
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

     /*                   //todo, product and question category in variable
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
                        ); */


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