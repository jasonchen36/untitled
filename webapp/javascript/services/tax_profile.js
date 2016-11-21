(function(){

    var $ = jQuery,
        that = app.services.taxProfile,
        cookies = app.cookies,
        landingPageContainer = $('#page-tax-profile');

    this.accountSessionCookie = 'accountSession';

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

    this.changePage = function(newPage){
        return new Promise(function(resolve,reject) {
            var data = cookies.getCookie(that.accountSessionCookie);
            that.updateAccountSession(data,newPage);
            var template = Handlebars.templates[newPage],
                html = template(data);
            landingPageContainer.html(html);
            resolve();
        })
            .then(function(){
                triggerInitScripts();
            });
    };

    this.goToNextPage = function(){
        var currentPage = getCurrentPage(),
            currentPageIndex;
        if (isMultiFiler()){
            currentPageIndex = that.multiFilerFlow.indexOf(currentPage);
            if (currentPageIndex !== that.multiFilerFlow.length-1){
                that.changePage(that.multiFilerFlow[currentPageIndex+1]);
            }
        } else {
            currentPageIndex = that.singleFilerFlow.indexOf(currentPage);
            if (currentPageIndex !== that.singleFilerFlow.length-1){
                that.changePage(that.singleFilerFlow[currentPageIndex+1]);
            }
        }

    };

    this.goToPreviousPage = function(){
        var currentPage = getCurrentPage(),
            currentPageIndex;
        if (isMultiFiler()){
            currentPageIndex = that.multiFilerFlow.indexOf(currentPage);
            if (currentPageIndex !== 0){
                that.changePage(that.multiFilerFlow[currentPageIndex-1]);
            }
        } else {
            currentPageIndex = that.singleFilerFlow.indexOf(currentPage);
            if (currentPageIndex !== 0){
                that.changePage(that.singleFilerFlow[currentPageIndex-1]);
            }
        }
    };

    this.updateAccountSession = function(data, currentPage){
        if(!currentPage){
            data.currentPage = getCurrentPage();
        } else {
            data.currentPage = currentPage;
        }
        cookies.setCookie(that.accountSessionCookie,data);
    };

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
        return cookies.setCookie(that.accountSessionCookie, {
            currentPage: that.singleFilerFlow[0]
        });
    }

    this.destroyAccountSession = function(){
        return cookies.clearCookie(that.accountSessionCookie);
    };

    function isMultiFiler(){
        if(!cookies.getCookie(that.accountSessionCookie).hasOwnProperty('filingType')){
            return false;
        } else {
            return Object.values(cookies.getCookie(that.accountSessionCookie).filingType).filter(function(value){return value === 1;}).length > 1;
        }
    }

    function getCurrentPage(){
        var accountSession = cookies.getCookie(that.accountSessionCookie);
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