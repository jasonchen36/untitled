(function(){

    /* *************** variables ***************/
    var $ = jQuery,
        that = app.services.personalProfile,
        landingPageContainer = $('#page-personal-profile'),
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
        personalProfileSessionStore = data;
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
    };

}).apply(app.services.personalProfile);