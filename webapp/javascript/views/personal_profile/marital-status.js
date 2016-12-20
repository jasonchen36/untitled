(function(){

    var $ = jQuery,
        that = app.views.personalProfile.maritalStatus,
        helpers = app.helpers,
        ajax = app.ajax,
        apiservice = app.apiservice,
        personalProfile = app.services.personalProfile,
        maritalStatusForm,
        maritalStatusSubmit,
        maritalStatusBack,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitMaritalStatus(){
        if (!maritalStatusSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormDataArray(maritalStatusForm);
            var sessionData = personalProfile.getPersonalProfileSession();
            var accountInfo = helpers.getAccountInformation(sessionData);
            var nameData = helpers.getFormDataArray(maritalStatusForm);
            nameData = nameData[0];
            if(!helpers.hasSelectedTile(formData)){
                //todo, real alert
                alert('no selected option');
            }else if ( helpers.hasMultipleSelectedTiles(formData)){
                //todo, real alert
                alert('please select only one option');
            } else {
                maritalStatusSubmit.addClass(disabledClass);
               /* ajax.ajax(
                    'POST',
                    '/personal-profile',
                    {
                        action: 'api-pp-marital-status',
                        data: formData
                    },
                    'json',
                    { }
                )
                    .then(function(response){
                        personalProfile.goToNextPage(response.data);
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                        maritalStatusSubmit.removeClass(disabledClass);
                    });*/

                return Promise.resolve()
                    .then(function() {
                        var promiseArrayPut = [];
                        var promiseArrayGet = [];
                        var promiseArrayQuestions = [];

                        //todo, product and question category in variable
                        var ajaxAnswers = apiservice.getQuestions(sessionData,9);
                        promiseArrayQuestions.push(ajaxAnswers);



                        _.each(formData, function(entry) {

                            //todo,
                            /*var ajaxOne =  apiservice.postAnswers(sessionData,
                                entry.taxReturnId, entry);
                            promiseArrayPut.push(ajaxOne);*/

                            var ajaxTwo = apiservice.getAnswers(sessionData,
                                entry.taxReturnId,9);

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
                            taxReturn.firstName = nameData[index];
                            taxReturn.answers = response[1][index];
                            taxReturn.questions = response[2][0];
                            index++;
                        });

                        personalProfile.goToNextPage(data);
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                        maritalStatusSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    this.init = function(){
        if ($('#personal-profile-marital-status').length > 0) {

            //variables
            maritalStatusForm = $('#marital-status-form');
            maritalStatusSubmit = $('#marital-status-submit');
            maritalStatusBack = $('#marital-status-back');
            checkbox = $('.checkbox');
            day = $('#birth-day');
            month = $('#birth-month');

            //listeners
            maritalStatusForm.on('submit',function(event){
                event.preventDefault();
                submitMaritalStatus();
            });

            maritalStatusSubmit.on('click',function(event){
                event.preventDefault();
                submitMaritalStatus();
            });

            maritalStatusBack.on('click',function(event){
                event.preventDefault();
                personalProfile.goToPreviousPage();
            });

            checkbox.on('click',function(event){
                event.preventDefault();
                $(this).toggleClass(helpers.activeClass);
                day.toggle();
                month.toggle();
            });
        }
    };

}).apply(app.views.personalProfile.maritalStatus);
