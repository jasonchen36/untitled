(function(){

    var $ = jQuery,
        that = app.helpers;

    this.errorClass = 'error';
    this.disabledClass = 'disabled';

    this.sizeOfObject = function(data){
        if (data){
            return Object.keys(data).length;
        } else {
            return 0;
        }
    };

    this.resetForm = function(formElement, clearInputValue){
        formElement.find('input').each(function(){
            $(this).removeClass(that.errorClass);
            if(clearInputValue){
                $(this).val('');
            }
        });
    };

    this.getFormData = function(formElement){
        var data = {};
        $(formElement).find('input').each(function(){
            data[$(this).attr('name')] = $(this).val();
        });
        return data;
    };

    this.formHasErrors = function(formElement){
        var errorCount = 0;
        formElement.find('input').each(function(){
            if($(this).hasClass(that.errorClass)){
                errorCount++;
            }
        });
        return errorCount > 0;
    };

    this.getBaseUrl = function(){
        //http://stackoverflow.com/questions/5817505/is-there-any-method-to-get-url-without-query-string-in-java-script
        return [location.protocol, '//', location.host, location.pathname].join('');
    };

    this.getUrlParameters = function(){
        var params={};
        window.location.search
            .replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str,key,value) {
                    params[key] = value;
                }
            );
        return params;
    };

    this.isValidEmail = function(email){
        //http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    };

    this.isValidPassword = function(password){
        //http://stackoverflow.com/questions/14850553/javascript-regex-for-password-containing-at-least-8-characters-1-number-1-uppe
        var regex = (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/);
        return regex.test(password);
    };

}).apply(app.helpers);