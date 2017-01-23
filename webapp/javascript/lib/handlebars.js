(function(){

    this.applyHelpers = function(){
        //compare
        Handlebars.registerHelper('compare', function(lvalue, rvalue, options) {
            //https://gist.github.com/doginthehat/1890659
            if (arguments.length !== 3) {
                throw new Error('Handlebars Helper "compare" needs 3 parameters');
            }
            var operator = options.hash.operator || '==';
            var operators = {
                '==':		function(l,r) { return l == r; },
                '===':	function(l,r) { return l === r; },
                '!=':		function(l,r) { return l != r; },
                '!==':	function(l,r) { return l !== r; },
                '<':		function(l,r) { return l < r; },
                '>':		function(l,r) { return l > r; },
                '<=':		function(l,r) { return l <= r; },
                '>=':		function(l,r) { return l >= r; },
                '&&':		function(l,r) { return l && r; },
                '||':		function(l,r) { return l || r; },
                'typeof':	function(l,r) { return typeof l == r; }
            };
            if (!operators[operator]) {
                throw new Error('Handlebars Helper "compare" doesn\'t know the operator ' + operator);
            }
            var result = operators[operator](lvalue,rvalue);
            if(result) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        });

        //debug
        Handlebars.registerHelper('debug', function(optionalValue) {
            console.log('Current Context');
            console.log('====================');
            console.log(this);
            if (optionalValue) {
                console.log('Value');
                console.log('====================');
                console.log(optionalValue);
            }
        });

        Handlebars.registerHelper('isActiveTile',function(id, activeTiles, options){
            if(activeTiles && activeTiles.hasOwnProperty(id) && activeTiles[id] == 1) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        });

        Handlebars.registerHelper('offsetEach',function(array, offset, options){
            //https://gist.github.com/burin/1048968
            var buffer = '';
            for (var i = 0; i < array.length-offset; i++) {
                var item = array[i+offset];
                item.customIndex = i;
                // show the inside of the block
                buffer += options.fn(item);
            }
            // return the finished buffer
            return buffer;
        });

        Handlebars.registerHelper('count',function(array){
            var arrayLength = 0;
            if(array && array.length > 0) {
                arrayLength = array.length;
            }
            return arrayLength;
        });

        Handlebars.registerHelper('isOptionSelected',function(lvalue, rvalue){
            if(lvalue && rvalue && lvalue.toLowerCase() === rvalue.toLowerCase()) {
                return 'selected=\"selected\"';
            } else {
                return '';
            }
        });

        // https://github.com/wycats/handlebars.js/issues/927
        Handlebars.registerHelper('switch', function(value, options) {
            this._switch_value_ = value;
            this._switch_break_ = false;
            var html = options.fn(this);
            delete this._switch_break_;
            delete this._switch_value_;
            return html;
        });

        Handlebars.registerHelper('case', function(value, options) {
            var args = Array.prototype.slice.call(arguments),
                caseValues = args;
            options = args.pop();

            if (this._switch_break_ || caseValues.indexOf(this._switch_value_) === -1) {
                return '';
            } else {
                if (options.hash.break === true) {
                    this._switch_break_ = true;
                }
                return options.fn(this);
            }
        });

        Handlebars.registerHelper('default', function(options) {
            if (!this._switch_break_) {
                return options.fn(this);
            }
        });

        Handlebars.registerHelper('documentImageHelper', function(imageUrl, documentName){
            if (!imageUrl || imageUrl.length < 1){
                var fileExtension = documentName.substring(documentName.lastIndexOf('.'), documentName.length),
                    fontAwesomeIcon;
                switch(fileExtension){
                    //images
                    case '.png':
                    case '.jpg':
                    case '.jpeg':
                    case '.gif':
                        fontAwesomeIcon = 'fa-file-image-o';
                        break;
                    //text
                    case '.doc':
                    case '.docx':
                    case '.txt':
                    case '.rtf':
                        fontAwesomeIcon = 'fa-file-text-o';
                        break;
                    //zip
                    case '.zip':
                        fontAwesomeIcon = 'fa-file-archive-o';
                        break;
                    //spreadsheet
                    case '.xls':
                    case '.xlsx':
                        fontAwesomeIcon = 'fa-file-excel-o';
                        break;
                    //powerpoint
                    case '.ppt':
                    case '.pptx':
                        fontAwesomeIcon = 'fa-file-powerpoint-o';
                        break;
                    //pdf
                    case '.pdf':
                        fontAwesomeIcon = 'fa-file-pdf-o';
                        break;
                    //default
                    default:
                        fontAwesomeIcon = 'fa-file-o';
                        break;
                }
                return '<i class="fa '+fontAwesomeIcon+'" aria-hidden="true"></i>';
            } else {
                return '<img class="full-width full-height" src="'+imageUrl+'"/>';
            }
        });

        Handlebars.registerHelper('hasDependantsSelected', function(answers, options){
            var hasDependantsSelected = false;
            _.each(answers,function(entry){
                if(entry.question_text.toLowerCase() === 'yes' && entry.answer == 1){
                    hasDependantsSelected = true;
                }
            });
            if (hasDependantsSelected){
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        });

    };
    
    Handlebars.registerHelper('shareDependant', function(taxReturns, currentId, options) {
        var isSpouseFiler = false;
        if(taxReturns && taxReturns.length > 0){
            taxReturns.forEach(function(entry){
                if (parseInt(entry.taxReturnId) === parseInt(currentId) && entry.filerType.toLowerCase() === 'spouse'){
                    isSpouseFiler = true;
                }
            });
        }
        return isSpouseFiler?options.fn(this):options.inverse(this);
    });

}).apply(app.handlebars);