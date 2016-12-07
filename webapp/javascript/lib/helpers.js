(function(){

    var $ = jQuery,
        that = app.helpers;

    this.activeClass = 'active';
    this.errorClass = 'error';
    this.disabledClass = 'disabled';
    this.tileClass = 'taxplan-tile';

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
        formElement.find('textarea').each(function(){
            $(this).removeClass(that.errorClass);
            if(clearInputValue){
                $(this).val('');
            }
        });
    };

    this.getFormData = function(formElement){
        var data = {};
        formElement.find('input').each(function(){
            if ($(this).attr('type') === 'checkbox'){
                data[$(this).attr('name')] = $(this).prop('checked')?1:0;
            } else {
                data[$(this).attr('name')] = $(this).val();
            }
        });
        formElement.find('textarea').each(function(){
            data[$(this).attr('name')] = $(this).val();
        });
        return data;
    };

    this.getTileFormData = function(formElement){
        var data = {};
        formElement.find('.'+that.tileClass).each(function(){
            data[parseInt($(this).attr('data-id'))] = $(this).hasClass(that.activeClass)?1:0;
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
        formElement.find('textarea').each(function(){
            if($(this).hasClass(that.errorClass)){
                errorCount++;
            }
        });
        return errorCount > 0;
    };

    this.hasSelectedTile = function(formData){
        return Object.values(formData).indexOf(1) !== -1;
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
        // var regex = (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/);
        // return regex.test(password);
        return password.length >= 8;
    };

    this.isEmpty = function(input){
        return !input || input.length < 1;
    };
    
    this.getAverage = function(index, length) {
        return Math.round(index / length * 100);
    };

}).apply(app.helpers);