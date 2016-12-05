(function(){

    /* *************** variables ***************/
    var $ = jQuery,
        that = app.services.taxProfile,
        helpers = app.helpers,
        animations = app.animations,
        landingPageContainer = $('#page-tax-profile'),
        profileBar = $('#tax-profile-progress-bar'),
        activeClass = helpers.activeClass,
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
            animateProgressBar();
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
        accountSessionStore.questions = questionsObject;
        if(!accountSessionStore.hasOwnProperty('currentPage') || accountSessionStore.currentPage.length < 1){
            accountSessionStore.currentPage = that.singleFilerFlow[0];
            changePage(accountSessionStore.currentPage);
        } else {
            that.goToNextPage();
        }
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
        return getAccountSession().currentPage;
    }

    function updateAccountSession(data,newPage){
        if(!data || typeof data !== 'object'){
            data = getAccountSession();
        }
        if(newPage && newPage.length > 0){
            data.currentPage = newPage;
        }
        data.questions = questionsObject;
        accountSessionStore = data;
    }
    
    function animateProgressBar(){
        var percentageComplete;
        if(isMultiFiler()){
            percentageComplete = helpers.getAverage(that.multiFilerFlow.indexOf(getCurrentPage()),that.multiFilerFlow.length);
        } else {
            percentageComplete = helpers.getAverage(that.singleFilerFlow.indexOf(getCurrentPage()),that.singleFilerFlow.length);
        }
        animations.animateElement(profileBar,{
            properties: {
                width: percentageComplete+'%'
            }
        });
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
            startAccountSession();

            //shared bindings
            $(document).on('click', '.taxplan-tile', function (event) {
                event.preventDefault();
                $(this).toggleClass(activeClass);
            });
            
            $(document).on('click', '.taxplan-tile-instructions', function (event) {
                event.preventDefault();
                event.stopPropagation();
                $('#tax-profile-instructions').html($(this).data('instructions'));
            });
            
        }
    };

}).apply(app.services.taxProfile);