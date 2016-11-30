(function(){

    /* *************** variables ***************/
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

    /* *************** private methods ***************/
    function changePage(newPage){
        return new Promise(function(resolve,reject) {
            var data = getAccountSession();
            //update session with new page
            updateAccountSession(data, newPage);
            var template = Handlebars.templates[newPage],
                html = template(data);
            landingPageContainer.html(html);
            resolve();
        })
            .then(function(){
                triggerInitScripts();
            });
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

    function updateAccountSession(data,newPage){
        if(!data || typeof data !== 'object'){
            data = getAccountSession();
        }
        data.currentPage = newPage;
        accountSessionStore = data;
    }

    /* *************** public methods ***************/
    this.goToNextPage = function(data){
        var currentPage = getCurrentPage(),
            currentPageIndex,
            newPage;
        //update session from ajax response
        updateAccountSession(data);
        if (isMultiFiler()){
            currentPageIndex = that.multiFilerFlow.indexOf(currentPage);
            if (currentPageIndex !== that.multiFilerFlow.length-1){
                newPage = that.multiFilerFlow[currentPageIndex+1];
                changePage(newPage);
            }
        } else {
            currentPageIndex = that.singleFilerFlow.indexOf(currentPage);
            if (currentPageIndex !== that.singleFilerFlow.length-1){
                newPage = that.singleFilerFlow[currentPageIndex+1];
                changePage(newPage);
            }
        }

    };

    this.goToPreviousPage = function(data){
        var currentPage = getCurrentPage(),
            currentPageIndex,
            newPage;
        //update session from ajax response
        updateAccountSession(data);
        if (isMultiFiler()){
            currentPageIndex = that.multiFilerFlow.indexOf(currentPage);
            if (currentPageIndex !== 0){
                newPage = that.multiFilerFlow[currentPageIndex-1];
                changePage(newPage);
            }
        } else {
            currentPageIndex = that.singleFilerFlow.indexOf(currentPage);
            if (currentPageIndex !== 0){
                newPage = that.singleFilerFlow[currentPageIndex-1];
                changePage(newPage);
            }
        }
    };

    this.init = function(){
        if (landingPageContainer.length > 0) {
            changePage(getCurrentPage());
        }
    };

}).apply(app.services.taxProfile);