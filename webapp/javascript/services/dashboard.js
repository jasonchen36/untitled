(function(){

    var $ = jQuery,
        that = app.services.dashboard,
        cookies = app.cookies,
        sidebarUploadActivate,
        sidebarChatActivate,
        sidebarMyReturnActivate,
        landingPageContainer = $('#dashboard-container');

    this.userSessionCookie = 'userSession';

    this.dashboardOrder = [
        'chat',
        'upload',
        'my-return'
    ];

    this.changePage = function(newPage){
        return new Promise(function(resolve,reject) {
            var data = cookies.getCookie(that.userSessionCookie);
            that.updateUserSession(data,newPage);
            var template = Handlebars.templates[newPage],
                html = template(data);
            landingPageContainer.html(html);
            resolve();
        })
            .then(function(){
                triggerInitScripts();
            });
    };

    this.updateUserSession = function(data, currentPage){
        if(!currentPage){
            data.currentPage = getCurrentPage();
        } else {
            data.currentPage = currentPage;
        }
        cookies.setCookie(that.userSessionCookie,data);
    };

    function triggerInitScripts(){
        var dashboardViews = app.views.dashboard;
        dashboardViews.upload.init();
        dashboardViews.chat.init();
        dashboardViews.myReturn.init();
    }

    function startUserSession(){
        return cookies.setCookie(that.userSessionCookie, {
            currentPage: that.dashboardOrder[0]
        });
    }

    function getCurrentPage(){
        var accountSession = cookies.getCookie(that.userSessionCookie);
        if (!accountSession) {
            return startUserSession().currentPage;
        } else {
            return accountSession.currentPage;
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
            that.changePage(getCurrentPage());
        }
    };

}).apply(app.services.dashboard);