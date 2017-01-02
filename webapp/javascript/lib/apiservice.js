(function(){

    var $ = jQuery,
        that = app.apiservice,
        helpers = app.helpers,
        ajax = app.ajax;




    this.getQuestions = function(sessionData, category){

        var accountInfo = helpers.getAccountInformation(sessionData);

        var uri = sessionData.apiUrl+'/questions/product/'+sessionData.productId+'/category/'+ category;

        var ajaxPromise = ajax.ajax(
            'GET',
            uri,
            {
            },
            'json',
            {
                'Authorization': 'Bearer '+ accountInfo.token
            }
        );

        return ajaxPromise;

    };


    this.putTaxReturnLegalName = function(sessionData, taxReturnId, firstName, lastName){

        var accountInfo = helpers.getAccountInformation(sessionData);

        var uri = sessionData.apiUrl + '/tax_return/' + taxReturnId;
        var ajaxPromise =ajax.ajax(
            'PUT',
            uri,
            {
                accountId: accountInfo.accountId,
                productId: accountInfo.productId,
                firstName: firstName,
                lastName: lastName
            },
            'json',
            {
                'Authorization': 'Bearer '+ accountInfo.token
            }
        );


        return ajaxPromise;

    };

    this.getTaxReturnLastName = function(sessionData, taxReturnId){

        var accountInfo = helpers.getAccountInformation(sessionData);

        var uri = sessionData.apiUrl + '/tax_return/' + taxReturnId;
        var ajaxPromise =ajax.ajax(
            'GET',
            uri,
            {
                accountId: accountInfo.accountId,
                productId: accountInfo.productId
            },
            'json',
            {
                'Authorization': 'Bearer '+ accountInfo.token
            }
        );


        return ajaxPromise;

    };


    this.getAnswers = function(sessionData, taxReturnId,  category){

        var accountInfo = helpers.getAccountInformation(sessionData);

        uri = sessionData.apiUrl + '/tax_return/' + taxReturnId + '/answers/category/' + category;

        var ajaxPromise = ajax.ajax(
            'GET',
            uri,
            {
            },
            'json',
            {
                'Authorization': 'Bearer '+ accountInfo.token
            }
        );

        return ajaxPromise;

    };



    this.postAnswers = function(sessionData, taxReturnId,  entry){

        var accountInfo = helpers.getAccountInformation(sessionData);

        var answerKeys = Object.keys(entry);
        var answers = [];
        var answerIndex = 0;

        _.each(entry, function(answer) {

            var questionId = answerKeys[answerIndex];
            if(!isNaN(questionId))
            {

                // TODO the server is not taking other answers when it should
                //  Change when API server is ready
                //      var text= answer;
                var text= '';

                if(answer === 1){
                    text = 'Yes';
                } else if (answer === 0){
                    text = 'No';
                }

                if(typeof text != 'undefined'  && text.length > 1) {

                    answers.push(
                        {
                            questionId: questionId,
                            text: text
                        });
                }
            }

            answerIndex++;


        });


        var uri = sessionData.apiUrl + '/tax_return/' +  taxReturnId + '/answers/';

        var ajaxPromise = ajax.ajax(
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

        return ajaxPromise;

    };

    this.postMaritalAnswers = function(sessionData, taxReturnId,  entry){

        var accountInfo = helpers.getAccountInformation(sessionData);

        var answerKeys = Object.keys(entry);
        var answers = [];
        var answerIndex = 0;

        var postObj = {};
        postObj.answers = [];


        _.each(entry, function(answer) {

            var questionId = answerKeys[answerIndex];
            if(!isNaN(questionId))
            {

                // TODO the server is not taking other answers when it should
                //  Change when API server is ready
                var text= answer;
                //     var text= '';

                if(answer === 1){
                    postObj.answers.push({
                        questionId: 149,
                        text: 'Yes'
                    });
                    text = '';
                } else if (answer === 0){
                    postObj.answers.push({
                        questionId: 149,
                        text: 'No'
                    });
                    text = '';
                }

                if(typeof text != 'undefined'  && text.length > 1) {

                    postObj.answers.push({
                        questionId: 129,
                        text: text
                    });
                }
            }

            answerIndex++;


        });


        var uri = sessionData.apiUrl + '/tax_return/' +  taxReturnId + '/answers/';

        var ajaxPromise = ajax.ajax(
            'POST',
            uri,
            {
                'answers': postObj.answers
            },
            'json-text',
            {
                'Authorization': 'Bearer '+ accountInfo.token
            }

        );

        return ajaxPromise;

    };

    this.postMaritalDate = function(sessionData, taxReturnId, entry) {
        var accountInfo = helpers.getAccountInformation(sessionData);

        var answers = [];

        var questionId = entry.questionId;

        _.each(entry, function(answer) {


            if(!isNaN(questionId) && questionId === 150) {

                var text = answer;

                // TODO better check later
                if (typeof text != 'undefined' && text.length === 10 && text != 'Common Law') {

                    answers.push(
                        {
                            questionId: questionId,
                            text: text
                        });
                }
            }

        });

        var uri = sessionData.apiUrl + '/tax_return/' +  taxReturnId + '/answers/';

        var ajaxPromise = ajax.ajax(
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

        return ajaxPromise;

    };

    this.getMessages = function(sessionData){

        var accountInfo = helpers.getAccountInformation(sessionData);

        uri = sessionData.apiUrl + '/messages';

        var ajaxPromise = ajax.ajax(
            'GET',
            uri,
            {
            },
            'json',
            {
                'Authorization': 'Bearer '+ accountInfo.token
            }
        );
        return ajaxPromise;

    };



    this.postMessages = function(sessionData, message){

        var accountInfo = helpers.getAccountInformation(sessionData);

        uri = sessionData.apiUrl + '/messages';

        var ajaxPromise = ajax.ajax(
            'POST',
            uri,
            {
                from: sessionData.users[0].id,
                body: message
            },
            'json-text',
            {
                'Authorization': 'Bearer '+ accountInfo.token
            }
        );
        return ajaxPromise;

    };




    this.getAccount = function(sessionData){

        var accountInfo = helpers.getAccountInformation(sessionData);

        uri = sessionData.apiUrl + '/account/' + accountInfo.accountId;

        var ajaxPromise = ajax.ajax(
            'GET',
            uri,
            {
            },
            'json',
            {
                'Authorization': 'Bearer '+ accountInfo.token
            }
        );

        return ajaxPromise;

    };



    this.getChecklist = function(sessionData, quoteId){

        var accountInfo = helpers.getAccountInformation(sessionData);

        uri = sessionData.apiUrl + '/quote/' + quoteId + '/checklist';

        var ajaxPromise = ajax.ajax(
            'GET',
            uri,
            {
            },
            'json',
            {
                'Authorization': 'Bearer '+ accountInfo.token
            }
        );

        return ajaxPromise;

    };

    this.getTaxReturns = function(sessionData){
        var accountInfo = helpers.getAccountInformation(sessionData),
            uri = sessionData.apiUrl + '/account/' + accountInfo.accountId;
        return ajax.ajax(
            'GET',
            uri,
            {},
            'json',
            {
                'Authorization': 'Bearer '+ accountInfo.token
            }
        ).then(function(response){
            var taxReturns = _.map(response.taxReturns, function(entry){
                return {
                    taxReturnId: entry.id,
                    productId: entry.product_id,
                    accountId: entry.account_id,
                    status: {
                        id: entry.status.id,
                        name: entry.status.name,
                        displayText: entry.status.display_text
                    },
                    firstName: entry.first_name,
                    lastName: entry.last_name,
                    province: entry.province_of_residence,
                    dateOfBirth: entry.date_of_birth,
                    canadianCitizen: entry.canadian_citizen,
                    authorizeCRA: entry.authorize_cra
                };
            });
            return Promise.resolve(taxReturns);
        });
    };

    this.getMarriageTiles = function(taxReturnId,answer){
        var marriageTiles = [
            {
                id:'married-married-'+taxReturnId,
                question_id:'129',
                instructions:'',
                question_text:'Married'
            },
            {
                id:'married-divorced-'+taxReturnId,
                question_id:'129',
                instructions:'',
                question_text:'Divorced'
            },
            {
                id:'married-separated-'+taxReturnId,
                question_id:'129',
                instructions:'',
                question_text:'Separated'
            },
            {
                id:'married-widowed-'+taxReturnId,
                question_id:'129',
                instructions:'',
                question_text:'Widowed'
            },
            {
                id:'married-common-law-'+taxReturnId,
                question_id:'129',
                instructions:'',
                question_text:'Common Law'
            },
            {
                id:'married-single-'+taxReturnId,
                question_id:'129',
                instructions:'',
                question_text:'Single'
            }
        ];
        return _.map(marriageTiles, function(entry){
            entry.class = answer===entry.question_text?helpers.activeClass:'';
            return entry;
        });
    };

    this.getDependants = function(sessionData, taxReturnId){
        var accountInfo = helpers.getAccountInformation(sessionData);
        return ajax.ajax(
            'GET',
            sessionData.apiUrl+'/tax_return/'+taxReturnId+'/dependants',
            {},
            'json',
            {
                'Authorization': 'Bearer '+ accountInfo.token
            }
        )
            .then(function(response){
                _.each(response, function(dependant){
                    dependant.day = moment(dependant.date_of_birth).format('DD');
                    dependant.month = moment(dependant.date_of_birth).format('MM');
                    dependant.year = moment(dependant.date_of_birth).format('YYYY');
                    return dependant;
                });
                return Promise.resolve(response);
            });
    };

    this.deleteDependantById = function(sessionData, taxReturnId, dependantId){
        var accountInfo = helpers.getAccountInformation(sessionData);
        return ajax.ajax(
            'DELETE',
            sessionData.apiUrl+'/tax_return/'+taxReturnId+'/dependant/'+dependantId,
            {},
            '',
            {
                'Authorization': 'Bearer '+ accountInfo.token
            }
        );
    };

    this.updateDependant = function(sessionData, taxReturnId, formData){
        var accountInfo = helpers.getAccountInformation(sessionData);
        return ajax.ajax(
            'PUT',
            sessionData.apiUrl+'/tax_return/'+taxReturnId+'/dependant/'+formData.id,
            {
                'firstName': formData.firstName,
                'lastName': formData.lastName,
                'dateOfBirth': formData.year+'-'+formData.month+'-'+formData.day,
                'relationship': formData.relationship
            },
            'json',
            {
                'Authorization': 'Bearer '+ accountInfo.token
            }
        );
    };

    this.createDependant = function(sessionData, taxReturnId, formData){
        var accountInfo = helpers.getAccountInformation(sessionData);
        return ajax.ajax(
            'POST',
            sessionData.apiUrl+'/tax_return/'+taxReturnId+'/dependant',
            {
                'firstName': formData.firstName,
                'lastName': formData.lastName,
                'dateOfBirth': formData.year+'-'+formData.month+'-'+formData.day,
                'relationship': formData.relationship
            },
            'json',
            {
                'Authorization': 'Bearer '+ accountInfo.token
            }
        );
    };
    
    this.linkDependant = function(sessionData, taxReturnId, dependantId){
        var accountInfo = helpers.getAccountInformation(sessionData);
        return ajax.ajax(
            'POST',
            sessionData.apiUrl+'/tax_return/'+taxReturnId+'/dependant/'+dependantId,
            {},
            '',
            {
                'Authorization': 'Bearer '+ accountInfo.token
            }
        );
    };

}).apply(app.apiservice);
