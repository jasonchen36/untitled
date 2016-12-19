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
      
        var answerKeys = Object.keys(entry)
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














}).apply(app.apiservice);
