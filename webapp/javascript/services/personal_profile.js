(function(){

    /* *************** variables ***************/
    var $ = jQuery,
        that = app.services.personalProfile,
        helpers = app.helpers,
        animations = app.animations,
        personalProfilePageContainer = $('#page-personal-profile'),
        profileBar = $('#tax-profile-progress-bar'),
        personalProfileSessionStore;

    this.personalProfileFlow = [
        'last-name',
        'income',
        'credits',
        'deductions',
        'special-scenarios',
        'marital-status',
        'dependants',
        'address',
        'birthdate'
    ];


    /* *************** private methods ***************/
    function changePage(newPage, data){
        return new Promise(function(resolve,reject) {

           var sessionData = that.getPersonalProfileSession();

           if(newPage && newPage.length > 0){
               sessionData.currentPage = newPage;
           }

            if(typeof data !== 'object'){
                data = sessionData;
            }

            animateProgressBar();
            var template = Handlebars.templates[newPage],
                html = template(data);
            personalProfilePageContainer.html(html);
            resolve();
        })
            .then(function(){
                triggerInitScripts();
            });
    }

    function triggerInitScripts(){
        var personalProfileViews = app.views.personalProfile;
        personalProfileViews.lastName.init();
        personalProfileViews.specialScenarios.init();
        personalProfileViews.maritalStatus.init();
        personalProfileViews.dependants.init();
        personalProfileViews.address.init();
        personalProfileViews.birthdate.init();
        personalProfileViews.income.init();
        personalProfileViews.deductions.init();
        personalProfileViews.credits.init();

        setSmallOptionTiles();
    }

    function startPersonalProfileSession(){
        personalProfileSessionStore = personalProfileObject;
        personalProfileSessionStore.questions = questionsObject;
        if(!personalProfileSessionStore.hasOwnProperty('currentPage') || personalProfileSessionStore.currentPage.length < 1){
            personalProfileSessionStore.currentPage = that.personalProfileFlow[0];
            changePage(personalProfileSessionStore.currentPage);
        } else {
            that.goToNextPage();
        }
    }

    function getCurrentPage(){
        var personalProfileSession = that.getPersonalProfileSession();
        if (!personalProfileSession) {
            return startPersonalProfileSession().currentPage;
        } else {
            return personalProfileSession.currentPage;
        }
    }

    function animateProgressBar(){
        var percentageComplete = helpers.getAverage(that.personalProfileFlow.indexOf(getCurrentPage()),that.personalProfileFlow.length);
        animations.animateElement(profileBar,{
            properties: {
                width: percentageComplete+'%'
            }
        });
    }

    function setSmallOptionTiles(){
        var sessionData = that.getPersonalProfileSession();
        if(sessionData.currentPage == "marital-status" || sessionData.currentPage == "dependants"){
            $('.'+helpers.tileClass).addClass("small-button");
        }
    }


    /* *************** public methods ***************/
    this.goToNextPage = function(data){
        var currentPage = getCurrentPage(),
            currentPageIndex = that.personalProfileFlow.indexOf(currentPage);
        if (currentPageIndex !== that.personalProfileFlow.length-1){
            changePage(that.personalProfileFlow[currentPageIndex+1], data);
        }
    };

    this.goToPreviousPage = function(data){
        var currentPage = getCurrentPage(),
            currentPageIndex = that.personalProfileFlow.indexOf(currentPage);
    
        if (currentPageIndex !== 0){
            changePage(that.personalProfileFlow[currentPageIndex-1], data);
        }
    };

    this.refreshPage = function(data){
        var currentPage = getCurrentPage(),
            currentPageIndex = that.personalProfileFlow.indexOf(currentPage),
            newPage;
        newPage = that.personalProfileFlow[currentPageIndex];
        changePage(newPage);
    };

    this.getPersonalProfileSession = function(){
        return personalProfileSessionStore;
    };



    this.init = function(){
        if (personalProfilePageContainer.length > 0) {
            startPersonalProfileSession();

            //shared bindings
            $(document)
                .on('touchend click', '.'+helpers.tileClass, function (event) {
                    event.preventDefault();
                    $(this).toggleClass(helpers.activeClass);
                })
                .on('mouseover', '.'+helpers.tileClass, function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $('#personal-profile-instructions').html($(this).data('instructions'));
                });
        }
    };

}).apply(app.services.personalProfile);
