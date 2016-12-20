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


    this.putTaxReturnLastName = function(sessionData, taxReturnId,  lastName){
  
        var accountInfo = helpers.getAccountInformation(sessionData);

        var uri = sessionData.apiUrl + '/tax_return/' + taxReturnId;
        var ajaxPromise =ajax.ajax(
              'PUT',
               uri,
               {
                   accountId: accountInfo.accountId,
                   productId: accountInfo.productId,
                   lastName: lastName
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

             var text= '';

             if(answer === 1){
                 text = 'Yes';
             } else if (answer === 0){
                 text = 'No';
             }

             if(text.length > 1) {
                                  
                 answers.push(
                     {
                         questionId: answerKeys[answerIndex],
                         text: text
                     });
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
