(function(){

    /* *************** variables ***************/
    var $ = jQuery,
        that = app.services.personalProfile,
        helpers = app.helpers,
        animations = app.animations,
        landingPageContainer = $('#page-personal-profile'),
        profileBar = $('#tax-profile-progress-bar'),
        personalProfileSessionStore;

    this.personalProfileFlow = [
        'last-name',
        'special-scenarios',
        'marital-status',
        'dependants',
        'address',
        'birthdate'
    ];


    /* *************** private methods ***************/
    function changePage(newPage){
        return new Promise(function(resolve,reject) {
            var data = getPersonalProfileSession();
            //update session with new page
            updatePersonalProfileSession(data, newPage);
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
        var personalProfile = app.views.personalProfile;
        personalProfile.lastName.init();
        personalProfile.specialScenarios.init();
        personalProfile.maritalStatus.init();
        personalProfile.dependants.init();
        personalProfile.address.init();
        personalProfile.birthdate.init();
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

    function getPersonalProfileSession(){
        return personalProfileSessionStore;
    }

    function getCurrentPage(){
        var personalProfileSession = getPersonalProfileSession();
        if (!personalProfileSession) {
            return startPersonalProfileSession().currentPage;
        } else {
            return personalProfileSession.currentPage;
        }
    }

    function updatePersonalProfileSession(data,newPage){
        if(!data || typeof data !== 'object'){
            data = getPersonalProfileSession();
        }
        if(newPage && newPage.length > 0){
            data.currentPage = newPage;
        }
        data.questions = questionsObject;
        personalProfileSessionStore = data;
    }

    function animateProgressBar(){
        var percentageComplete = helpers.getAverage(that.personalProfileFlow.indexOf(getCurrentPage()),that.personalProfileFlow.length);
        animations.animateElement(profileBar,{
            properties: {
                width: percentageComplete+'%'
            }
        });
    }

    /* *************** public methods ***************/
    this.goToNextPage = function(data){
        var currentPage = getCurrentPage(),
            currentPageIndex = that.personalProfileFlow.indexOf(currentPage);
        //update session from ajax response
        updatePersonalProfileSession(data);
        if (currentPageIndex !== that.personalProfileFlow.length-1){
            changePage(that.personalProfileFlow[currentPageIndex+1]);
        }
    };

    this.goToPreviousPage = function(data){
        var currentPage = getCurrentPage(),
            currentPageIndex = that.personalProfileFlow.indexOf(currentPage);
        //update session from ajax response
        updatePersonalProfileSession(data);
        if (currentPageIndex !== 0){
            changePage(that.personalProfileFlow[currentPageIndex-1]);
        }
    };

    this.init = function(){
        if (landingPageContainer.length > 0) {
            startPersonalProfileSession();
        }

        //shared bindings
        $(document).on('click', '.'+helpers.tileClass, function (event) {
            event.preventDefault();
            $(this).toggleClass(helpers.activeClass);
        });

        $(document).on('click', '.'+helpers.tileClass+'-instructions', function (event) {
            event.preventDefault();
            event.stopPropagation();
            $('#personal-profile-instructions').html($(this).data('instructions'));
        });
    };

}).apply(app.services.personalProfile);