(function(){

    var $ = jQuery,
        that = app.helpers;

    this.activeClass = 'active';
    this.errorClass = 'error';
    this.disabledClass = 'disabled';
    this.tileClass = 'taxplan-tile';
    this.tileContainerClass = 'taxplan-tile-container';

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

        for(var element in formData){
            if(formData[element] === 1){
                selectedCount++;
            }
        }

        if(selectedCount > 1){
            return true;
        }

        return false;
    };

    this.noneAppliedMultipleSelectedTiles = function(formData){
        //todo, is none apply always last tile?

        var lastFormVal = formData[Object.keys(formData)[Object.keys(formData).length - 1]];

        if( (lastFormVal === 1) && (this.hasMultipleSelectedTiles(formData)) ) {
            return true;
        }

        return false;
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