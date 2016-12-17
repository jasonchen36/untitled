

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

                        _.each(formData, function(entry) {

                            // todo, insert staging api url
                            var uri = 'http://staging.taxplancanada.ca/api' + '/tax_return/' + entry.taxReturnId;
                            var ajaxOne =ajax.ajax(
                                'PUT',
                                uri,
                                {
                                    accountId: accountInfo.accountId,
                                    productId: accountInfo.productId,
                                    lastName: entry.lastName
                                },
                                'json'
                            );

                            uri = 'http://staging.taxplancanada.ca/api' + '/tax_return/' + entry.taxReturnId + '/answers';

                            //todo, update with new API route to get tax return with questions and answers in one object
                            var ajaxTwo = ajax.ajax(
                             'GET',
                             uri,
                             {
                             },
                             'json'
                             );

                            promiseArrayPut.push(ajaxOne);
                            promiseArrayGet.push(ajaxTwo);

                        });

                        return Promise.all([Promise.all(promiseArrayPut),
                            Promise.all(promiseArrayGet)]);

                    })
                    .then(function(response) {

                        // todo update data with right fields when API route updated
                        var data = {};
                        data.accountInfo = accountInfo;
                        data.taxReturns = formData;
                        data.answers = response[1];

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