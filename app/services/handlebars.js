module.exports = {
    compare: function(lvalue, rvalue, options) {
        //https://gist.github.com/doginthehat/1890659
        if (arguments.length !== 3) {
            throw new Error('Handlebars Helper "compare" needs 3 parameters');
        }
        var operator = options.hash.operator || '==';
        var operators = {
            '==':		function(l,r) { return l == r; },
            '===':	function(l,r) { return l === r; },
            '===/i':	function(l,r) { return l.toLowerCase() === r.toLowerCase(); },
            '!==':	function(l,r) { return l !== r; },
            '!=':		function(l,r) { return l != r; },
            '<':		function(l,r) { return l < r; },
            '>':		function(l,r) { return l > r; },
            '<=':		function(l,r) { return l <= r; },
            '>=':		function(l,r) { return l >= r; },
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
    },
    isNotEmpty: function(data, options){
        if(data && String(data).length > 0) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    },
    debug: function(optionalValue) {
        console.log("Current Context");
        console.log("====================");
        console.log(this);
        if (optionalValue) {
            console.log("Value");
            console.log("====================");
            console.log(optionalValue);
        }
    },
    checked: function(lvalue, rvalue){
        return String(lvalue) === String(rvalue)?'checked="checked"':'';
    },
    selected: function(lvalue, rvalue){
        return String(lvalue) === String(rvalue)?'selected="selected"':'';
    }
};