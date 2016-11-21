(function(){
    
    this.isMultiFiler = function(req){
        return Object.values(req.session.account.filingType).count(1) > 1;
    };
    
}).apply(app.session);