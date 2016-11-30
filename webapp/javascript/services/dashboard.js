(function(){

    /* *************** variables ***************/
    var $ = jQuery,
        that = app.services.dashboard,
        sidebarUploadActivate,
        sidebarChatActivate,
        sidebarMyReturnActivate,
        userSessionStore,
        landingPageContainer = $('#dashboard-container');

    this.dashboardOrder = [
        'chat',
        'upload',
        'my-return'
    ];


    /* *************** private methods ***************/
    function updateUserSession(data, newPage){
        if(!data || typeof data !== 'object'){
            data = getUserSession();
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

    function getUserSession(){
        return userSessionStore;
    }

    function getCurrentPage(){
        var userSession = getUserSession();
        if (!userSession) {
            return startUserSession().currentPage;
        } else {
            return userSession.currentPage;
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
                data = getUserSession();
            }
            //update session with new page
            updateUserSession(data, newPage);
            var template = Handlebars.templates[newPage],
                html = template(data);
            landingPageContainer.html(html);
            resolve();
        })
            .then(function () {
                triggerInitScripts();
            });
    };

    this.init = function(){
        if (landingPageContainer.length > 0) {

            //variables
            sidebarUploadActivate = $('#dashboard-upload-activate');
            sidebarChatActivate = $('#dashboard-chat-activate');
            sidebarMyReturnActivate = $('#dashboard-my-return-activate');

            //listeners
            sidebarUploadActivate.on('click',function(event){
                event.preventDefault();
                changePageHelper('upload');
            });

            sidebarChatActivate.on('click',function(event){
                event.preventDefault();
                changePageHelper('chat');
            });

            sidebarMyReturnActivate.on('click',function(event){
                event.preventDefault();
                changePageHelper('my-return');
            });

            //functions
            that.changePage(getCurrentPage(), true);
        }
    };

}).apply(app.services.dashboard);