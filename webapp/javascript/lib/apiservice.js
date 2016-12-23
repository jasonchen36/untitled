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




}).apply(app.apiservice);
