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
                // show the inside of the block
                buffer += options.fn(item);
            }
            // return the finished buffer
            return buffer;
        });

    };
    
}).apply(app.handlebars);