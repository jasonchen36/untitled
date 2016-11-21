(function(){

    var $ = jQuery,
        that = app.services.personalProfile,
        cookies = app.cookies,
        landingPageContainer = $('#page-personal-profile');

    this.personalProfileSessionCookie = 'personalProfileSession';

    this.personalProfileFlow = [
        'last-name',
        'special-scenarios',
        'marital-status',
        'dependants',
        'address',
        'birthdate'
    ];

    this.changePage = function(newPage){
        return new Promise(function(resolve,reject) {
            var data = cookies.getCookie(that.personalProfileSessionCookie);
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
        cookies.setCookie(that.personalProfileSessionCookie,data);
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
        return cookies.setCookie(that.personalProfileSessionCookie, {
            currentPage: that.personalProfileFlow[0]
        });
    }

    this.destroyPersonalProfileSession = function(){
        return cookies.clearCookie(that.personalProfileSessionCookie);
    };

    function getCurrentPage(){
        var accountSession = cookies.getCookie(that.personalProfileSessionCookie);
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