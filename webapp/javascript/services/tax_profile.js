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
        console.log(accountObject);
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
        console.log('this gets hit on updateAccountSession');
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
            newPage,
            accountSession;
        //update session from ajax response
        updateAccountSession(data);
        if (currentPageIndex !== that.taxProfileFlow.length-1){
            accountSession = that.getAccountSession();
            newPage = that.taxProfileFlow[currentPageIndex+1];
            if(newPage === 'filers-names' && !accountSession.users[1].hasOwnProperty('id') && !accountSession.users[2].hasOwnProperty('id')){
                //skip if only one filer
                newPage = that.taxProfileFlow[currentPageIndex+2];
            }
            changePage(newPage);
        }
    };

    this.goToPreviousPage = function(data){
        var currentPage = getCurrentPage(),
            currentPageIndex = that.taxProfileFlow.indexOf(currentPage),
            newPage,
            accountSession;
        //update session from ajax response
        updateAccountSession(data);
        if (currentPageIndex !== 0){
            accountSession = that.getAccountSession();
            newPage = that.taxProfileFlow[currentPageIndex-1];
            if(newPage === 'filers-names' && !accountSession.users[1].hasOwnProperty('id') && !accountSession.users[2].hasOwnProperty('id')){
                //skip if only one filer
                newPage = that.taxProfileFlow[currentPageIndex-2];
            }
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
                .on('touchend click', '.'+helpers.tileClass, function (event) {
                    event.preventDefault();
                    var that = $(this),
                        dataType = that.attr('data-type');
                    if (!that.hasClass(helpers.activeClass)){
                        if (dataType === 'NotSure' || dataType === 'NoneApply') {
                            //remove active state from regular tile
                            that.parent().find('.'+helpers.tileClass).each(function(){
                                $(this).removeClass(helpers.activeClass);
                            });
                        } else {
                            //regular tile, remove active state from notsure and noneapply
                            that.parent().find('.'+helpers.tileClass+'[data-type="NotSure"], .'+helpers.tileClass+'[data-type="NoneApply"]').each(function(){
                                $(this).removeClass(helpers.activeClass);
                            });
                        }
                        that.addClass(helpers.activeClass);
                    } else {
                        that.removeClass(helpers.activeClass);
                    }
                })
                .on('mouseover', '.'+helpers.tileClass, function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $('#tax-profile-instructions').html($(this).data('instructions'));
                    $('#tax-profile-sidebar-header').html($(this).data('text'));
                    $('#tax-profile-sidebar-image').attr('data-id', $(this).data('id'));
                    $('#tax-profile-sidebar-image').addClass('showfade');
                    $('#tax-profile-sidebar-image-initial').addClass('showfade');
                })
                .on('mouseleave', '.'+helpers.tileClass, function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $('#tax-profile-instructions').html($(this).data('category_displaytext'));
                    $('#tax-profile-sidebar-header').html($(this).data('category_name'));
                    $('#tax-profile-sidebar-image').removeClass('showfade');
                    $('#tax-profile-sidebar-image-initial').removeClass('showfade');
                });

        }
    };

}).apply(app.services.taxProfile);
