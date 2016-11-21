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

    this.changePage = function(currentPage){
        return new Promise(function(resolve,reject) {
            var data = store.get(that.accountSessionCookie),
                template = Handlebars.templates[currentPage],
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

    function triggerInitScripts(){
        var taxProfileViews = app.views.taxProfile;
        taxProfileViews.welcome.init();
        taxProfileViews.filingFor.init();
    }

    function startAccountSession(){
        return cookies.setCookie(that.accountSessionCookie, {
            currentPage: that.singleFilerFlow[0],
            nextPage: that.singleFilerFlow[1],
            previousPage: null
        });
    }

    function isMultiFiler(){
        return Object.values(cookies.getCookie(that.accountSessionCookie).filingType).count(1) > 1;
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
        if ($('#page-tax-profile').length > 0) {
            that.changePage(getCurrentPage());
        }
    };

}).apply(app.services.taxProfile);