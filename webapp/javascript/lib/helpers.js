(function(){

    var $ = jQuery,
        that = app.helpers;

    this.activeClass = 'active';
    this.errorClass = 'error';
    this.disabledClass = 'disabled';
    this.hiddenClass = 'hidden';
    this.tileClass = 'taxplan-tile';
    this.tileContainerClass = 'taxplan-tile-container';
    this.formContainerClass = 'taxplan-form-container';
    this.cookieCurrentPage = 'store-current-page';
    this.errorLabelClass = 'label-error';

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
        var data = {},
            container,
            containerId,
            input;
        if (formElement.find('.'+that.formContainerClass).length > 0){
            //for multi-user forms
            formElement.find('.'+that.formContainerClass).each(function(){
                container = $(this);
                containerId = container.attr('data-id');
                data[containerId] = {};
                container.find('input').each(function(){
                    input = $(this);
                    if (input.attr('type') === 'checkbox'){
                        data[containerId][input.attr('name')] = input.prop('checked')?1:0;
                    } else {
                        data[containerId][input.attr('name')] = input.val();
                    }
                });
                container.find('textarea').each(function(){
                    input = $(this);
                    data[containerId][input.attr('name')] = input.val();
                });
                container.find('select').each(function(){
                    input = $(this);
                    data[containerId][input.attr('name')] = input.val();
                });
            });
        } else {
            //for regular forms like login, register, etc
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
            formElement.find('select').each(function(){
                input = $(this);
                data[input.attr('name')] = input.val();
            });
        }
        return data;
    };

    this.getFormDataArray = function(formElement){
        var data = [],
            container,
            containerId,
            input;
        if (formElement.find('.'+that.formContainerClass).length > 0){
            //for multi-user forms
            formElement.find('.'+that.formContainerClass).each(function(){
                container = $(this);
                containerId = container.attr('data-id');
                var userData = {name:containerId};
                container.find('input').each(function(){
                    input = $(this);
                    if (input.attr('type') === 'checkbox'){
                        userData[input.attr('name')] = input.prop('checked')?1:0;
                    } else {
                        userData[input.attr('name')] = input.val();
                    }
                });
                container.find('textarea').each(function(){
                    input = $(this);
                    userData[input.attr('name')] = input.val();
                });
                data.push(userData);
            });
        } else {
            //for regular forms like login, register, etc
            var userData = {};
            var index = 0;
            formElement.find('input').each(function(){
                input = $(this);
                if ($(this).attr('type') === 'checkbox'){
                    userData[input.attr('name')] = $(this).prop('checked')?1:0;
                } else if($(this).attr('type') === 'hidden') {
                    userData[index] = $(this).val();
                    index++;
                }
            });

            formElement.find('textarea').each(function(){
                input = $(this);
                userData[input.attr('name')] = $(this).val();
            });
            data.push(userData);
        }
        return data;
    };

    this.getAccountInformation= function(sessionData){
        var data = {};

        data.token = sessionData.token;
        data.firstName = sessionData.users[0].firstName;
        data.accountId = sessionData.users[0].accountId;
        data.productId = 10;

        return data;

    };

    this.getTileFormData = function(formElement){
        var data = {},
            container,
            containerId,
            tile;
        formElement.find('.'+that.tileContainerClass).each(function(){
            container = $(this);
            containerId = container.attr('data-id');
            data[containerId] = {};
            container.find('.'+that.tileClass).each(function(){
                tile = $(this);
                data[containerId][parseInt(tile.attr('data-id'))] = tile.hasClass(that.activeClass)?1:0;
            });
        });
        return data;
    };

    this.getTileFormDataArray = function(formElement){
        var data = [],
            container,
            containerId,
            tile;
        formElement.find('.'+that.tileContainerClass).each(function(){
            container = $(this);
            containerId = container.attr('data-id');
            var userData = {taxReturnId:container.attr('data-id'), firstName:container.attr('value')};
            //data[containerId] = {};
            container.find('.'+that.tileClass).each(function(){
                tile = $(this);
                //data[containerId][parseInt(tile.attr('data-id'))] = tile.hasClass(that.activeClass)?1:0;
                userData[parseInt(tile.attr('data-id'))] = tile.hasClass(that.activeClass)?1:0;
            });
            data.push(userData);
        });
        return data;
    };


    this.getMaritalStatusFormDataArray = function(formElement){
        var data = [],
            container,
            containerId,
            tile;
        formElement.find('.'+that.tileContainerClass).each(function(){
            container = $(this);
            containerId = container.attr('data-id');
            var userData = {taxReturnId:container.attr('data-id'),
                firstName:container.attr('value')};


            tile = $("#marital-status-changed-" + containerId);


            // TODO find a better way to do this
            userData[149] = tile.hasClass(that.activeClass)? 1:0;

            tile = $("#marital-status-day-" + containerId);
            tile = $("#marital-status-month-" + containerId);


            container.find('.'+that.activeClass).each(function(){
                tile = $(this);
                userData[parseInt(tile.attr('data-id'))] = tile.attr('data-value');
            });
            data.push(userData);
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
        formElement.find('select').each(function(){
            if($(this).hasClass(that.errorClass)){
                errorCount++;
            }
        });
        return errorCount > 0;
    };

    this.hasSelectedTile = function(formData){
        var hasSelectedTile = false;
        _.forOwn(formData, function(value, key) {
            if(Object.values(formData[key]).indexOf(1) !== -1){
                hasSelectedTile = true;
            }
        });
        return hasSelectedTile;
    };

    this.hasMultipleSelectedTiles = function(formData){

        var selectedCount = 0;

        _.forOwn(formData, function(value, key) {
            Object.values(formData[key]).forEach(function (entry) {
                if (entry === 1) {
                    selectedCount++;
                }
            });

        });
        return selectedCount > 1;
    };

    this.noneAppliedMultipleSelectedTiles = function(formData){
        //todo, is none apply always last tile?
        var lastFormVal = -1;
        _.forOwn(formData, function(value, key) {
            Object.values(formData[key]).forEach(function (entry, index) {
                if(index === (Object.values(formData[key]).length - 1)){
                    if(entry === 1) {
                        lastFormVal = 1;
                    }
                }

            });
        });
        return lastFormVal === 1 && this.hasMultipleSelectedTiles(formData);
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

    this.isMatchingFields = function(firstField, secondField){
        return firstField == secondField;
    };

    this.isValidPassword = function(password){
        //http://stackoverflow.com/questions/14850553/javascript-regex-for-password-containing-at-least-8-characters-1-number-1-uppe
        // var regex = (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/);
        // return regex.test(password);
        return password.length >= 8;
    };

    this.isEmpty = function(input){
        if (!input){
            return true;
        } else if (input.length < 1){
            return true;
        } else {
            return false;
        }
    };

    this.getAverage = function(index, length) {
        return Math.round(index / length * 100);
    };

    this.isValidPostalCode = function (postalCode) {
        //todo, not working with m5r2r7
        // var regex = new RegExp(/^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i);
        // return regex.test(postalCode.value);
        return true;
    };
    
    this.isValidDay = function(value){
        return !that.isEmpty(value.trim()) && value.trim().length === 2 && parseInt(value) >= 1 && parseInt(value) <= 31;
    };
    
    this.isValidMonth = function(value){
        return !that.isEmpty(value.trim()) && value.trim().length === 2 && parseInt(value) >= 1 && parseInt(value) <= 12;
    };
    
    this.isValidYear = function(value){
        return !that.isEmpty(value.trim()) && value.trim().length === 2;
    };
    
    this.isValidFullYear = function(value){
        return !that.isEmpty(value.trim()) && value.trim().length === 4;
    };

}).apply(app.helpers);
