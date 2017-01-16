(function(){

    var $ = jQuery,
        that = app.apiservice,
        helpers = app.helpers,
        ajax = app.ajax;



    this.putRequestReset = function(apiurl, email){

        var uri = apiurl + '/users/reset';
        var ajaxPromise =ajax.ajax(
            'PUT',
            uri,
            {
                 email: email
            },
            'json-text'
        );


        return ajaxPromise;

    };


    this.putAuthorizedPasswordReset = function(apiurl, password, token){

        var uri = apiurl + '/users/reset/' + token ;
        var ajaxPromise =ajax.ajax(
            'PUT',
            uri,
            {
                password: password
            },
            'json-text'
        );


        return ajaxPromise;

    };






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



    this.getChecklist = function(sessionData){

        var accountInfo = helpers.getAccountInformation(sessionData);

        uri = sessionData.apiUrl + '/quote/' + sessionData.quoteId + '/checklist';

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
                    provinceOfResidence: entry.province_of_residence,
                    dateOfBirth: entry.date_of_birth,
                    canadianCitizen: entry.canadian_citizen,
                    authorizeCRA: entry.authorize_cra,
                    filerType: entry.filer_type
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
                    if(dependant.is_shared === 1) {
                        dependant.isShared = 'active';
                    }else{
                        dependant.isShared = '';
                    }
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
        if (!formData.isShared){
          formData.isShared = 0;
        }
        return ajax.ajax(
            'PUT',
            sessionData.apiUrl+'/tax_return/'+taxReturnId+'/dependant/'+formData.id,
            {
                'firstName': formData.first_name,
                'lastName': formData.last_name,
                'dateOfBirth': formData.year+'-'+formData.month+'-'+formData.day,
                'relationship': formData.relationship,
                'isShared': formData.isShared.toString()
            },
            'json',
            {
                'Authorization': 'Bearer '+ accountInfo.token
            }
        );
    };

    this.completedProfileStatusChange = function(sessionData, accountInfo, formData){
      _.map(formData, function (entry, key){
        body = {
          statusId: 3
        };
      return ajax.ajax(
        'PUT',
        sessionData.apiUrl+'/tax_return/'+key+'/status',
        body,
        'json',
        {
          'Authorization': 'Bearer '+ accountInfo.token
        }
      );
    });
  };

    this.createDependant = function(sessionData, taxReturnId, formData){
        var accountInfo = helpers.getAccountInformation(sessionData);
        if (!formData.isShared){
          formData.isShared = 0;
        }
        return ajax.ajax(
            'POST',
            sessionData.apiUrl+'/tax_return/'+taxReturnId+'/dependant',
            {
                'firstName': formData.first_name,
                'lastName': formData.last_name,
                'dateOfBirth': formData.year+'-'+formData.month+'-'+formData.day,
                'relationship': formData.relationship,
                'isShared': formData.isShared.toString()
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

    this.getAddresses = function(sessionData, taxReturnId){
        var accountInfo = helpers.getAccountInformation(sessionData);
        return ajax.ajax(
          'GET',
            sessionData.apiUrl+'/tax_return/'+taxReturnId+'/addresses',
            {},
            'json',
            {
                'Authorization': 'Bearer '+ accountInfo.token
            }
        );
    };

    this.createAddress = function(sessionData, taxReturnId, formData){
        var accountInfo = helpers.getAccountInformation(sessionData);
        return ajax.ajax(
            'POST',
            sessionData.apiUrl+'/tax_return/'+taxReturnId+'/address',
            {
                addressLine1: formData.street,
                city: formData.city,
                province: formData.province,
                postalCode: formData.postalCode,
                country: formData.country

            },
            'json',
            {
                'Authorization': 'Bearer '+ accountInfo.token
            }
        );
    };

    this.linkExistingAddresses = function(sessionData, taxReturnId, addressId){
        var accountInfo = helpers.getAccountInformation(sessionData);
        return ajax.ajax(
            'POST',
            sessionData.apiUrl+'/tax_return/'+taxReturnId+'/address/'+addressId,
            {},
            'json',
            {
                'Authorization': 'Bearer '+ accountInfo.token
            }
        );
    };

    this.updateAddress = function(sessionData, taxReturnId, addressId, formData){
        var accountInfo = helpers.getAccountInformation(sessionData);
        return ajax.ajax(
            'PUT',
            sessionData.apiUrl+'/tax_return/'+taxReturnId+'/address/'+addressId,
            {
                addressLine1: formData.street,
                city: formData.city,
                province: formData.province,
                postalCode: formData.postalCode,
                country: formData.country
            },
            'json',
            {
                'Authorization': 'Bearer '+ accountInfo.token
            }
        );
    };

    this.updateProvinceOfResidence = function(sessionData, taxReturnId, formData){
      var accountInfo = helpers.getAccountInformation(sessionData);
        return ajax.ajax(
            'PUT',
            sessionData.apiUrl+'/tax_return/'+taxReturnId,
            {
                accountId: accountInfo.accountId,
                productId: accountInfo.productId,
                provinceOfResidence: formData.provinceResidence
            },
            'json',
            {
                'Authorization': 'Bearer '+ accountInfo.token
            }
        );
    };

    this.updateDateOfBirthCheckboxes = function(sessionData, taxReturnId, formData){
        var accountInfo = helpers.getAccountInformation(sessionData);
        return ajax.ajax(
            'PUT',
            sessionData.apiUrl+'/tax_return/'+taxReturnId,
            {
                accountId: accountInfo.accountId,
                productId: accountInfo.productId,
                dateOfBirth: entireYear + "-" + entry.birthdate_month + "-" + entry.birthdate_day,
                canadianCitizen: entry.canadian_citizen.toString(),
                authorizeCra: entry.CRA_authorized.toString()
            },
            'json',
            {
                'Authorization': 'Bearer '+ accountInfo.token
            }
        );
    };



    this.deleteDocument = function(sessionData,quoteId, documentId){

        var accountInfo = helpers.getAccountInformation(sessionData);

        var uri = sessionData.apiUrl + '/quote/'+quoteId+'/document/'+documentId;

        var ajaxPromise = ajax.ajax(
            'DELETE',
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



    this.submitReturn = function(sessionData, quoteId){

        var accountInfo = helpers.getAccountInformation(sessionData);

        var uri = sessionData.apiUrl + '/quote/'+quoteId+'/submit/';

        var ajaxPromise = ajax.ajax(
            'POST',
            uri,
            {
                accountId: accountInfo.accountId,
                productId: accountInfo.productId
            },
            'json-text',
            {
                'Authorization': 'Bearer '+ accountInfo.token
            }
        );

        return ajaxPromise;
    };


   this.getPdfChecklist = function(sessionData, fileName){

        var accountInfo = helpers.getAccountInformation(sessionData);

        var uri = sessionData.apiUrl + '/quote/'+sessionData.quoteId+'/checklist/PDF';

        var ajaxPromise = ajax.ajaxDownload(
            uri,
            accountInfo.token,
            fileName
        );

        return ajaxPromise;
    };


    this.markMessagesAsRead = function(sessionData){

        var accountInfo = helpers.getAccountInformation(sessionData);

        var uri = sessionData.apiUrl + '/messages/markAllRead';

        var ajaxPromise = ajax.ajax(
            'POST',
            uri,
            {},
            'json',
            {
                'Authorization': 'Bearer '+ accountInfo.token
            }
        );

    };



}).apply(app.apiservice);
