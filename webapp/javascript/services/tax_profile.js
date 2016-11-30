(function(){

    var $ = jQuery,
        that = app.services.taxProfile,
        landingPageContainer = $('#page-tax-profile'),
        accountSessionStore;
    
    this.singleFilerFlow = [
        'welcome',
        'filing-for',
        'income',
        'credits',
        'deductions',
        'quote'
    ];

    this.multiFilerFlow = [
        'welcome',
        'filing-for',
        'filers-names',
        'income-multi',
        'credits-multi',
        'deductions-multi',
        'quote-multi'
    ];

    this.changePage = function(newPage, data){
        return new Promise(function(resolve,reject) {
            if(typeof data !== 'object'){
                data = getAccountSession();
            }
            updateAccountSession(data,newPage);
            var template = Handlebars.templates[newPage],
                html = template(data);
            landingPageContainer.html(html);
            resolve();
        })
            .then(function(){
                triggerInitScripts();
            });
    };

    this.goToNextPage = function(data){
        var currentPage = getCurrentPage(),
            currentPageIndex;
        if (isMultiFiler()){
            currentPageIndex = that.multiFilerFlow.indexOf(currentPage);
            if (currentPageIndex !== that.multiFilerFlow.length-1){
                that.changePage(that.multiFilerFlow[currentPageIndex+1],data);
            }
        } else {
            currentPageIndex = that.singleFilerFlow.indexOf(currentPage);
            if (currentPageIndex !== that.singleFilerFlow.length-1){
                that.changePage(that.singleFilerFlow[currentPageIndex+1],data);
            }
        }

    };

    this.goToPreviousPage = function(data){
        var currentPage = getCurrentPage(),
            currentPageIndex;
        if (isMultiFiler()){
            currentPageIndex = that.multiFilerFlow.indexOf(currentPage);
            if (currentPageIndex !== 0){
                that.changePage(that.multiFilerFlow[currentPageIndex-1],data);
            }
        } else {
            currentPageIndex = that.singleFilerFlow.indexOf(currentPage);
            if (currentPageIndex !== 0){
                that.changePage(that.singleFilerFlow[currentPageIndex-1],data);
            }
        }
    };

    function updateAccountSession(data, currentPage){
        if(!currentPage){
            data.currentPage = getCurrentPage();
        } else {
            data.currentPage = currentPage;
        }
        accountSessionStore = data;
    }

    function triggerInitScripts(){
        var taxProfileViews = app.views.taxProfile;
        taxProfileViews.welcome.init();
        taxProfileViews.filingFor.init();
        taxProfileViews.filersNames.init();
        taxProfileViews.income.init();
        taxProfileViews.incomeMulti.init();
        taxProfileViews.deductions.init();
        taxProfileViews.deductionsMulti.init();
        taxProfileViews.credits.init();
        taxProfileViews.creditsMulti.init();
        taxProfileViews.quote.init();
        taxProfileViews.quoteMulti.init();
    }

    function startAccountSession(){
        accountSessionStore = accountObject;
        accountSessionStore.currentPage = that.singleFilerFlow[0];
        return accountSessionStore;
    }
    
    function getAccountSession(){
        return accountSessionStore;
    }

    function isMultiFiler(){
        if(!getAccountSession().hasOwnProperty('filingType')){
            return false;
        } else {
            return Object.values(getAccountSession().filingType).filter(function(value){return value === 1;}).length > 1;
        }
    }

    function getCurrentPage(){
        var accountSession = getAccountSession();
        if (!accountSession) {
            return startAccountSession().currentPage;
        } else {
            return accountSession.currentPage;
        }
    }

    this.init = function(){
        if (landingPageContainer.length > 0) {
            that.changePage(getCurrentPage());
        }
    };

}).apply(app.services.taxProfile);