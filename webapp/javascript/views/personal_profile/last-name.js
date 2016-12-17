

(function(){

    var $ = jQuery,
        that = app.views.personalProfile.lastName,
        helpers = app.helpers,
        ajax = app.ajax,
        personalProfile = app.services.personalProfile,
        lastNameForm,
        lastNameSubmit,
        lastNameBack,
        lastNameInput,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitLastName(){
        if (!lastNameSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormDataArray(lastNameForm);
            var accountInfo = helpers.getAccountInformation(lastNameForm);
            helpers.resetForm(lastNameForm);


            var sessionData = personalProfile.getPersonalProfileSession();
            console.log(JSON.stringify(sessionData));

            // todo, error checking for lastname entered
            if (!helpers.hasName(formData)){
                //todo, proper error message
                alert("Please enter your last name.");
                lastNameForm.addClass(errorClass);
            } else if (!helpers.formHasErrors(lastNameForm)) {
                lastNameSubmit.addClass(disabledClass);

                return Promise.resolve()
                    .then(function() {
                        var promiseArrayPut = [];
                        var promiseArrayGet = [];
                        var promiseArrayQuestions = [];

                        //todo, product and question category in variable
                        var uri = 'http://staging.taxplancanada.ca/api' + '/questions/product/' + 10 + '/category/' + 1;

                        var ajaxAnswers = ajax.ajax(
                            'GET',
                            uri,
                            {
                            },
                            'json'
                        );

                        promiseArrayQuestions.push(ajaxAnswers);

                        _.each(formData, function(entry) {

                            // todo, insert staging api url
                            var uri = 'http://staging.taxplancanada.ca/api' + '/tax_return/' + entry.taxReturnId;
                            var ajaxUpdate =ajax.ajax(
                                'PUT',
                                uri,
                                {
                                    accountId: accountInfo.accountId,
                                    productId: accountInfo.productId,
                                    lastName: entry.lastName
                                },
                                'json',
                                {
                                  'Authorization': 'Bearer '+ sessionData.token
                                }
                            );

                             uri = 'http://staging.taxplancanada.ca/api' + '/tax_return/' + entry.taxReturnId + '/answers';

                             var ajaxAnswers = ajax.ajax(
                             'GET',
                             uri,
                             {
                             },
                             'json',
                             {
                               'Authorization': 'Bearer '+ sessionData.token
                             }
                             );

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