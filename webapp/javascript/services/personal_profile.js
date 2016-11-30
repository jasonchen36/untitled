(function(){

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

    this.changePage = function(newPage,data){
        return new Promise(function(resolve,reject) {
            if(!data){
                data = getPersonalProfileSession();
            }
            that.updatePersonalProfileSession(data,newPage);
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
            currentPageIndex = that.personalProfileFlow.indexOf(currentPage);
        if (currentPageIndex !== that.personalProfileFlow.length-1){
            that.changePage(that.personalProfileFlow[currentPageIndex+1]);
        }
    };

    this.goToPreviousPage = function(){
        var currentPage = getCurrentPage(),
            currentPageIndex = that.personalProfileFlow.indexOf(currentPage);
        if (currentPageIndex !== 0){
            that.changePage(that.personalProfileFlow[currentPageIndex-1]);
        }
    };

    this.updatePersonalProfileSession = function(data, currentPage){
        if(!currentPage){
            data.currentPage = getCurrentPage();
        } else {
            data.currentPage = currentPage;
        }
        personalProfileSessionStore = data;
    };

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
        personalProfileSessionStore.currentPage = that.personalProfileFlow[0];
        return personalProfileSessionStore;
    }

    function getPersonalProfileSession(){
        return personalProfileSessionStore;
    }

    function getCurrentPage(){
        var accountSession = getPersonalProfileSession();
        if (!accountSession) {
            return startPersonalProfileSession().currentPage;
        } else {
            return accountSession.currentPage;
        }
    }

    this.init = function(){
        if (landingPageContainer.length > 0) {
            that.changePage(getCurrentPage());
        }
    };

}).apply(app.services.personalProfile);