(function() {
    var that = app.ajax,
        helpers = app.helpers,
        $ = jQuery;

    this.ajax = function(method,url,data,contentType, headers) {
        var parameters =  {
            method: method,
            url: url,
            data: data,
            xhrFields: {
                withCredentials: true
            },
            headers: headers
        };
        if(data && helpers.sizeOfObject(data) > 0) {
            if (contentType === 'json') {
                parameters.data = JSON.stringify(data);
                parameters.contentType= 'application/json';
                parameters.dataType = contentType;
            } else if (contentType === 'json-text') {
                parameters.data = JSON.stringify(data);
                parameters.contentType= 'application/json';
                parameters.dataType = 'text';
            } else {
                parameters.data = data;
            }
        }
        return that.ajaxCall(parameters);
    };

    this.ajaxCall = function(parameters) {
        return new Promise(function(resolve,reject) {
            $.ajax(parameters)
                .then(function(data) {
                    resolve(data);
                })
                .fail(function(jqXHR,textStatus,errorThrown) {
                    reject({
                        jqXHR:jqXHR,
                        textStatus:textStatus,
                        errorThrown:errorThrown
                    });
                });
        });
    };

    this.ajaxCatch = function(jqXHR,textStatus,errorThrown){
        console.log(jqXHR,textStatus,errorThrown);
        if(textStatus === 'parsererror'){
            window.location.href = '/login';
        }
    };




  this.ajaxDownload = function(url,  token, fileName) {

      return new Promise(function(resolve,reject) {
           
          var request = new XMLHttpRequest();
          request.open("GET", url, true); 
          request.responseType = "blob";
          request.onload = function (e) {

              if (this.status === 200) {
                  // `blob` response
                  if(window.navigator.msSaveOrOpenBlob) {
                    //  IE - http://stackoverflow.com/questions/24007073/open-links-made-by-createobjecturl-in-ie11
                    var anchorSelector = '#export';
                    var fileData = [this.response];
                    blobObject = new Blob(fileData);
                    window.navigator.msSaveOrOpenBlob(blobObject, fileName);               
                  } else {            
              
                    // create `objectURL` of `this.response` : `.pdf` as `Blob`
                    var file = window.URL.createObjectURL(this.response);
                    var a = document.createElement("a");
                    a.href = file;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    // remove `a` following `Save As` dialog, 
                    // `window` regains `focus`
                    window.onfocus = function () {  
                   
                        var element =  document.getElementById("a");
                        if (typeof(element) != 'undefined' && element != null)
                        {
                            document.body.removeChild(a);
                        }
                      }
                 } 

                 resolve();

             } 
             else {
                 reject();
             }
         
          };
          request.setRequestHeader("authorization", "Bearer " + token);
          request.send();

       });

   };

 
}).apply(app.ajax);
