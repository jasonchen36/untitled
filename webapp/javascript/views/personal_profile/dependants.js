(function(){

    var $ = jQuery,
        that = app.views.personalProfile.dependants,
        helpers = app.helpers,
        personalProfile = app.services.personalProfile,
        dependantsForm,
        ajax = app.ajax,
        apiservice = app.apiservice,
        dependantsSubmit,
        dependantsBack,
        dependantsSave,
        dependantsEdit,
        dependantsDelete,
        tileOptions,
        errorClass = app.helpers.errorClass,
        activeClass = app.helpers.activeClass,
        disabledClass = app.helpers.disabledClass;

    function submitDependants(){
        if (!dependantsSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormDataArray(dependantsForm);
            var sessionData = personalProfile.getPersonalProfileSession();
            var accountInfo = helpers.getAccountInformation(sessionData);
            if(!helpers.hasSelectedTile(formData)){
                window.location.hash = 'modal-personal-profile-popup';
            }else if ( helpers.hasMultipleSelectedTiles(formData)){
            } else {
                dependantsSubmit.addClass(disabledClass);
                return Promise.resolve()
                    .then(function() {
                        var promiseArrayPut = [];
                        var promiseArrayGet = [];
                        var promiseArrayQuestions = [];

                        //todo, product and question category in variable
                        var ajaxAnswers = apiservice.getQuestions(sessionData,2);
                        promiseArrayQuestions.push(ajaxAnswers);

                        _.each(formData, function(entry) {

                            //todo,
                            /*var ajaxOne =  apiservice.postAnswers(sessionData,
                             entry.taxReturnId, entry);
                             promiseArrayPut.push(ajaxOne);*/

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
                        dependantsSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    function updateDependants(){
        if (!dependantsSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormDataArray(dependantsForm);
            var sessionData = personalProfile.getPersonalProfileSession();
            var accountInfo = helpers.getAccountInformation(sessionData);
            var nameData = helpers.getFormDataArray(dependantsForm);
            nameData = nameData[0];
                dependantsSubmit.addClass(disabledClass);
                /*app.ajax.ajax(
                    'POST',
                    '/personal-profile',
                    {
                        action: 'api-pp-dependants',
                        data: formData
                    },
                    'json',
                    { }
                )*/
                return Promise.resolve()
                    .then(function() {
                        var promiseArrayPut = [];
                        var promiseArrayGet = [];
                        var promiseArrayQuestions = [];

                        //todo, product and question category in variable
                        var ajaxAnswers = apiservice.getQuestions(sessionData,2);
                        promiseArrayQuestions.push(ajaxAnswers);

                        _.each(formData, function(entry) {

                            //todo,
                            /*var ajaxOne =  apiservice.postAnswers(sessionData,
                             entry.taxReturnId, entry);
                             promiseArrayPut.push(ajaxOne);*/

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

                        personalProfile.goToPreviousPage(data);
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        ajax.ajaxCatch(jqXHR,textStatus,errorThrown);
                        dependantsSubmit.removeClass(disabledClass);
                    });
            }
    }

    function updateUserDependants(selectedTile,parentContainer){
        var accountSession = personalProfile.getPersonalProfileSession(),
            formData = helpers.getTileFormData(dependantsForm);
        //enforce toggle
        _.forOwn(formData[parentContainer.attr('data-id')], function(value, key) {
            if(key !== selectedTile.attr('data-id')){
                formData[parentContainer.attr('data-id')][key] = 0;
            }
        });
        //save temporary changes
        accountSession.users.forEach(function(entry){
            entry.activeTiles.dependants = formData[entry.id];
            try {
                //if "yes" is selected
                entry.hasDependants = formData[entry.id][9201];//todo, find better way of linking model id
            } catch(exception){
//do nothing
            }
        });
        personalProfile.refreshPage(accountSession);
    }

    this.init = function(){
        if ($('#personal-profile-dependants').length > 0) {

            //variables
            dependantsForm = $('#dependants-form');
            dependantsSubmit = $('#dependants-submit');
            dependantsBack = $('#dependants-back');
            dependantsSave = $('#dependants-save');
            dependantsEdit = $('#dependants-edit');
            dependantsDelete = $('#dependants-delete');
            tileOptions = $('.taxplan-tile');
            dependantsContainer = $('#container-dependants-form');
            add = $('.i--icon-add');
            dependantsDelete = $('#dependants-delete');
            dependantsContainerLine = $('#side-info-blurb3');
            dependantsContainerLine2 = $('#side-info-blurb2');
            save = $('#dependants-save');
            firstName = $('#dependants-first-name');
            lastName = $('#dependants-last-name');
            day = $('#dependants-birthday-day');
            month = $('#dependants-birthday-month');
            year = $('#dependants-birthday-year');

            //overwrite standard tile selector active toggle
            $(document).off('click', '.'+helpers.tileClass);

            //listeners
            dependantsForm.on('submit',function(event){
                event.preventDefault();
                submitDependants();
            });

            dependantsSubmit.on('click',function(event){
                event.preventDefault();
                submitDependants();
            });

            dependantsSave.on('click',function(event){
                event.preventDefault();
                //TODO: Save dependant function
            });

            dependantsEdit.on('click',function(event){
                event.preventDefault();
                //TODO: Edit dependant function
            });

            dependantsDelete.on('click',function(event){
                event.preventDefault();
                //TODO: Delete dependant function
            });

            dependantsBack.on('click',function(event){
                event.preventDefault();
                updateDependants();
            });

            tileOptions.on('click',function(event){
                event.preventDefault();
                $(this).toggleClass(helpers.activeClass);
                //updateUserDependants($(this),$(this).parent());
            });

            add.on('click',function(event){
                event.preventDefault();
                dependantsContainer.toggle();
            });

            dependantsDelete.on('click',function(event){
                event.preventDefault();
                dependantsContainerLine.remove();
                dependantsContainerLine2.remove();
            });

            save.on('click',function(event){
                event.preventDefault();
                $('#side-info-blurb3').append('<p>' + firstName.val() + " " + lastName.val() + '</p>');
                $('#side-info-blurb2').append('<p>' + day.val() + '/' + month.val() + '/' + year.val().slice(-2) + '</p>');
            });

            var formData = helpers.getTileFormDataArray(dependantsForm);

            _.each(formData, function(taxReturn){

                var hasDependants = $('#has-dependants-' + taxReturn.taxReturnId);
                var noDependants = $('#no-dependants-' + taxReturn.taxReturnId);

                var dependantsForm = $('#container-dependants-form-' + taxReturn.taxReturnId);
                var dependantsLine = $('#container-dependants-line-' + taxReturn.taxReturnId);

                hasDependants.on('click', function(event){
                    event.preventDefault();
                    noDependants.removeClass(activeClass);

                    if(hasDependants.hasClass(activeClass)) {
                        dependantsForm.show();
                        dependantsLine.show();
                    }else{
                        dependantsForm.hide();
                        dependantsLine.hide();
                    }
                });

                noDependants.on('click', function(event){
                    event.preventDefault();
                    hasDependants.removeClass(activeClass);
                    dependantsForm.hide();
                    dependantsLine.hide();
                });
            });

        }
    };

}).apply(app.views.personalProfile.dependants);
