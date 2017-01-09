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




  this.ajaxDownload = function(url,  headers, fileName, anchor) {
        var parameters =  {
            url: url,
            type: 'GET',
            dataType: 'binary',
            headers: headers,
            processData: false
        };
 
     
       return new Promise(function(resolve,reject) {
             $.ajax(parameters)
                 .then(function(data) {
                   

                // TODO  this is not being triggered yet
              //  http://stackoverflow.com/questions/24501358/how-to-set-a-header-for-a-http-get-request-and-trigger-file-download/24523253#24523253
              //  I think  https://github.com/henrya/js-jquery/tree/master/BinaryTransport
              // needs to be added to work

                var windowUrl = window.URL || window.webkitURL;
                var url = windowUrl.createObjectURL(blob);
                anchor.prop('href', url);
                anchor.prop('download', fileName);
                anchor.get(0).click();
                windowUrl.revokeObjectURL(url);


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

    // From https://github.com/henrya/js-jquery/blob/master/BinaryTransport/jquery.binarytransport.js
    this.binaryTransport = function($, undefined) {
        "use strict";

        // use this transport for "binary" data type
        $.ajaxTransport("+binary", function(options, originalOptions, jqXHR) {
            // check for conditions and support for blob / arraybuffer response type
            if (window.FormData && ((options.dataType && (options.dataType == 'binary')) || (options.data && ((window.ArrayBuffer && options.data instanceof ArrayBuffer) || (window.Blob && options.data instanceof Blob))))) {
                return {
                    // create new XMLHttpRequest
                    send: function(headers, callback) {
                        // setup all variables
                        var xhr = new XMLHttpRequest(),
                            url = options.url,
                            type = options.type,
                            async = options.async || true,
                        // blob or arraybuffer. Default is blob
                            dataType = options.responseType || "blob",
                            data = options.data || null,
                            username = options.username || null,
                            password = options.password || null;

                        xhr.addEventListener('load', function() {
                            var data = {};
                            data[options.dataType] = xhr.response;
                            // make callback and send data
                            callback(xhr.status, xhr.statusText, data, xhr.getAllResponseHeaders());
                        });

                        xhr.open(type, url, async, username, password);

                        // setup custom headers
                        for (var i in headers) {
                            xhr.setRequestHeader(i, headers[i]);
                        }

                        xhr.responseType = dataType;
                        xhr.send(data);
                    },
                    abort: function() {}
                };
            }
        });
    };


}).apply(app.ajax);
