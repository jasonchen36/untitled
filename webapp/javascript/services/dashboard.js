(function(){

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

    this.changePage = function(newPage, data){
        return new Promise(function (resolve, reject) {
            if(typeof data !== 'object'){
                data = getUserSession();
            }
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

    function updateUserSession(data, currentPage){
        if(!currentPage){
            data.currentPage = getCurrentPage();
        } else {
            data.currentPage = currentPage;
        }
        console.log('update',data,userSessionStore);
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
        console.log('start',userObject,userSessionStore);
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

    this.init = function(){
        if (landingPageContainer.length > 0) {

            //variables
            sidebarUploadActivate = $('#dashboard-upload-activate');
            sidebarChatActivate = $('#dashboard-chat-activate');
            sidebarMyReturnActivate = $('#dashboard-my-return-activate');

            //listeners
            sidebarUploadActivate.on('click',function(event){
                event.preventDefault();
                that.changePage('upload');
            });

            sidebarChatActivate.on('click',function(event){
                event.preventDefault();
                that.changePage('chat');
            });

            sidebarMyReturnActivate.on('click',function(event){
                event.preventDefault();
                that.changePage('my-return');
            });

            //functions
            that.changePage(getCurrentPage(), true);
        }
    };

}).apply(app.services.dashboard);