(function(){

    /* *************** variables ***************/
    var $ = jQuery,
        that = app.services.taxProfile,
        helpers = app.helpers,
        animations = app.animations,
        taxProfilePageContainer = $('#page-tax-profile'),
        profileBar = $('#tax-profile-progress-bar'),
        accountSessionStore;

    this.taxProfileFlow = [
        'welcome',
        'filing-for',
        'filers-names',
        'quote-applies',
        'quote'
    ];

    /* *************** private methods ***************/
    function changePage(newPage){
        return new Promise(function(resolve,reject) {
            var data = that.getAccountSession();
            //update session with new page
            updateAccountSession(data, newPage);
            animateProgressBar();
            var template = Handlebars.templates[newPage],
                html = template(data);
            taxProfilePageContainer.html(html);
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
        taxProfileViews.quote.init();
        taxProfileViews.quoteApplies.init();
        taxProfileViews.modalQuote.init();
    }

    function startAccountSession(){
        accountSessionStore = accountObject;
        accountSessionStore.questions = questionsObject;
        if(!accountSessionStore.hasOwnProperty('currentPage') || accountSessionStore.currentPage.length < 1){
            accountSessionStore.currentPage = that.taxProfileFlow[0];
            changePage(accountSessionStore.currentPage);
        } else {
            that.goToNextPage();
        }
    }

    function getCurrentPage(){
        return that.getAccountSession().currentPage;
    }

    function updateAccountSession(data,newPage){
        if(!data || typeof data !== 'object'){
            data = that.getAccountSession();
        }
        if(newPage && newPage.length > 0){
            data.currentPage = newPage;
        }
        data.questions = questionsObject;
        accountSessionStore = data;
    }

    function animateProgressBar(){
        var percentageComplete = helpers.getAverage(that.taxProfileFlow.indexOf(getCurrentPage()),that.taxProfileFlow.length);
        animations.animateElement(profileBar,{
            properties: {
                width: percentageComplete+'%'
            }
        });
    }


    /* *************** public methods ***************/
    this.goToNextPage = function(data){
        var currentPage = getCurrentPage(),
            currentPageIndex = that.taxProfileFlow.indexOf(currentPage),
            newPage;
        //update session from ajax response
        updateAccountSession(data);
        if (currentPageIndex !== that.taxProfileFlow.length-1){
            newPage = that.taxProfileFlow[currentPageIndex+1];
            changePage(newPage);
        }
    };

    this.goToPreviousPage = function(data){
        var currentPage = getCurrentPage(),
            currentPageIndex = that.taxProfileFlow.indexOf(currentPage),
            newPage;
        //update session from ajax response
        updateAccountSession(data);
        if (currentPageIndex !== 0){
            newPage = that.taxProfileFlow[currentPageIndex-1];
            changePage(newPage);
        }
    };

    this.refreshPage = function(data){
        var currentPage = getCurrentPage(),
            currentPageIndex = that.taxProfileFlow.indexOf(currentPage),
            newPage;
        //update session with new data
        updateAccountSession(data);
        newPage = that.taxProfileFlow[currentPageIndex];
        changePage(newPage);
    };

    this.getAccountSession = function(){
        return accountSessionStore;
    };

    this.init = function(){
        if (taxProfilePageContainer.length > 0) {
            startAccountSession();

            //shared bindings
            $(document)
                .on('click', '.'+helpers.tileClass, function (event) {
                    event.preventDefault();
                    $(this).toggleClass(helpers.activeClass);
                })
                .on('click', '.'+helpers.tileClass+'-instructions', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $('#tax-profile-instructions').html($(this).data('instructions'));
                });

        }
    };

}).apply(app.services.taxProfile);