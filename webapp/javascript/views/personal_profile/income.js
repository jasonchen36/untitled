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
            //var formData = helpers.getTileFormData(incomeForm);
            var formData = helpers.getFormDataArray(incomeForm);
            var accountInfo = helpers.getAccountInformation(incomeForm);
            if(!helpers.hasSelectedTile(formData)){
                //todo, real alert
                alert('no selected option');
            } else if(helpers.noneAppliedMultipleSelectedTiles(formData)){
                //todo, real alert
                alert('cannot select None Apply with other options');
            } else {
                /*incomeSubmit.addClass(disabledClass);
                ajax.ajax(
                    'POST',
                    '/personal-profile',
                    {
                        action: 'api-pp-income',
                        data: formData
                    },
                    'json'
                )
                    .then(function(response){
                        personalProfile.goToNextPage(response.data);
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                        incomeSubmit.removeClass(disabledClass);
                    });*/

                return Promise.resolve()
                    .then(function() {
                        var promiseArrayPut = [];
                        var promiseArrayGet = [];

                        _.each(formData, function(entry) {

                            // todo, verify this PUT answers loop after API routes in place
                            _.each(entry.answers, function(answer) {

                                // todo, update after answers PUT route is created
                                // todo, insert staging api url
                                var uri = 'http://staging.taxplancanada.ca/api' + '/tax_return/' + entry.taxReturnId + '/answers/' + answer.id;
                                var ajaxOne = ajax.ajax(
                                    'PUT',
                                    uri,
                                    {
                                        accountId: accountInfo.accountId,
                                        productId: accountInfo.productId,
                                        lastName: entry.lastName
                                    },
                                    'json'
                                );

                                promiseArrayPut.push(ajaxOne);
                            });

                            //todo, update with new API route to get tax return with questions and answers in one object
                            uri = 'http://staging.taxplancanada.ca/api' + '/tax_return/' + entry.taxReturnId + '/answers';

                            var ajaxTwo = ajax.ajax(
                                'GET',
                                uri,
                                {
                                },
                                'json'
                            );

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