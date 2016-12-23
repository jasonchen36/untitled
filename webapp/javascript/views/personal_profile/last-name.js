

(function(){

    var $ = jQuery,
        that = app.views.personalProfile.lastName,
        helpers = app.helpers,
        apiservice = app.apiservice,
        ajax = app.ajax,
        personalProfile = app.services.personalProfile,
        lastNameForm,
        lastNameSubmit,
        lastNameBack,
        lastNameInput,
        lastNameErrorLabelLastName,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitLastName(){
        if (!lastNameSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormDataArray(lastNameForm);
            helpers.resetForm(lastNameForm);
            var sessionData = personalProfile.getPersonalProfileSession();
            var accountInfo = helpers.getAccountInformation(sessionData);
            //TODO: Add validation for other filers
            if (helpers.isEmpty(formData[0].lastName)){
                lastNameInput.addClass(errorClass);
                lastNameErrorLabelLastName.addClass(errorClass);
            } else {
            //if (!helpers.formHasErrors(lastNameForm)) {
                lastNameSubmit.addClass(disabledClass);

                return Promise.resolve()
                    .then(function() {
                        var promiseArrayPut = [];
                        var promiseArrayGet = [];
                        var promiseArrayQuestions = [];

                        var ajaxAnswers = apiservice.getQuestions(sessionData,1);

                        promiseArrayQuestions.push(ajaxAnswers);


                        _.each(formData, function(entry) {


                             var ajaxUpdate = apiservice.putTaxReturnLegalName(
                                     sessionData, entry.taxReturnId, entry.firstName, entry.lastName);


                             var ajaxAnswers = apiservice.getAnswers(sessionData,
                                                    entry.taxReturnId,1);



                            promiseArrayPut.push(ajaxUpdate);
                            promiseArrayGet.push(ajaxAnswers);

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
                        lastNameSubmit.removeClass(disabledClass);
                    });
            }
        }
    }
    this.init = function(){
        if ($('#personal-profile-last-name').length > 0) {

            //variables
            lastNameForm = $('#last-name-form');
            lastNameSubmit = $('#last-name-submit');
            lastNameBack = $('#last-name-back');
            lastNameInput = $('#last-name-input');
            lastNameErrorLabelLastName = $('#last-name-label-error-last-name');

            //listeners
            lastNameForm.on('submit',function(event){
                event.preventDefault();
                submitLastName();
            });

            lastNameSubmit.on('click',function(event){
                event.preventDefault();
                submitLastName();
            });
        }
    };

}).apply(app.views.personalProfile.lastName);
