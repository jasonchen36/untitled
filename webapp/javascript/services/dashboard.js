(function(){

    /* *************** variables ***************/
    var $ = jQuery,
        that = app.services.dashboard,
        cookies = app.cookies,
        userSessionStore,
        landingPageContainer = $('#dashboard-container'),
        dashboardStateCookie = 'store-dashboard-state';

    this.dashboardOrder = [
        'chat',
        'upload',
        'my-return'
    ];


    /* *************** private methods ***************/
    function updateUserSession(data, newPage){
        if(!data || typeof data !== 'object'){
            data = that.getUserSession();
        }
        if(newPage && newPage.length > 0){
            data.currentPage = newPage;
        }
        userSessionStore = data;
    }

    function triggerInitScripts(){
        var dashboardViews = app.views.dashboard;
        dashboardViews.upload.init();
        dashboardViews.chat.init();
        dashboardViews.myReturn.init();
    }

    function startUserSession(){
        userSessionStore = userObject;
        userSessionStore.currentPage = that.dashboardOrder[0];
        return userSessionStore;
    }

    function getCurrentPage(){
        var userSession = that.getUserSession(),
            dashboardState = cookies.getCookie(dashboardStateCookie);
        if (!userSession) {
            startUserSession();
        }
        if(dashboardState && dashboardState.hasOwnProperty('currentPage')){
            return dashboardState.currentPage;
        } else {
            cookies.setCookie(dashboardStateCookie, {
                currentPage: that.dashboardOrder[0]
            });
            return that.dashboardOrder[0];
        }
    }

    function changePageHelper(pageName){
        if (getCurrentPage() !== pageName) {
            that.changePage(pageName);
        }
    }


    /* *************** public methods ***************/
    this.changePage = function(newPage, data){
        return new Promise(function (resolve, reject) {
            if(typeof data !== 'object'){
                data = that.getUserSession();
            }
            //update session with new page
            updateUserSession(data, newPage);
            cookies.setCookie(dashboardStateCookie, {
                currentPage: newPage
            });
            var template = Handlebars.templates[newPage],
                html = template(data);
            landingPageContainer.html(html);
            resolve();
        })
            .then(function () {
                triggerInitScripts();
            });
    };


    this.refreshPage = function(data){
        var currentPage = getCurrentPage(),
            currentPageIndex = that.dashboardOrder.indexOf(currentPage),
            newPage;
        //update session with new data
        updateUserSession(data);
        newPage = that.dashboardOrder[currentPageIndex];
        that.changePage(newPage);
    };

    this.getUserSession = function(){
        return userSessionStore;
    };

    this.init = function(){
        if (landingPageContainer.length > 0) {

            //shared bindings
            $(document)
                .on('click', '#dashboard-upload-activate', function (event) {
                    event.preventDefault();
                    changePageHelper('upload');
                })
                .on('click', '#dashboard-chat-activate', function (event) {
                    event.preventDefault();
                    changePageHelper('chat');
                })
                .on('click', '#dashboard-my-return-activate', function (event) {
                    event.preventDefault();
                    changePageHelper('my-return');
                });

            //functions
            that.changePage(getCurrentPage(), true);
        }
    };

}).apply(app.services.dashboard);