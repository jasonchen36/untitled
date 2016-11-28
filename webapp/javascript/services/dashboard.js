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

    this.changePage = function(newPage, overrideDuplicate){
        if(newPage === 'chat'){
            startUserSession();
        }
        if(overrideDuplicate || newPage !== getCurrentPage()) {
            return new Promise(function (resolve, reject) {
                var data = getUserSession();
                that.updateUserSession(data, newPage);
                var template = Handlebars.templates[newPage],
                    html = template(data);
                landingPageContainer.html(html);
                resolve();
            })
                .then(function () {
                    triggerInitScripts();
                });
        }
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
        var sessionObject = userObject;
        sessionObject.currentPage = that.dashboardOrder[0];
        sessionObject.expiry = moment().add(1,'hour');
        destroyUserSession();
        return cookies.setCookie(that.userSessionCookie, sessionObject);
    }

    function getUserSession(){
        return cookies.getCookie(that.userSessionCookie);
    }

    function destroyUserSession(){
        cookies.setCookie(that.userSessionCookie,{});
    }

    function hasUserSession(){
        var accountSession = getUserSession();
        if (accountSession) {
            if (accountSession.hasOwnProperty('expiry') && moment().isBefore(accountSession.expiry)) {
                return true;
            } else {
                destroyUserSession();
                return false;
            }
        } else {
            return false;
        }
    }

    function getCurrentPage(){
        var hasSession = hasUserSession(),
            accountSession = getUserSession();
        if (!hasSession) {
            return startUserSession().currentPage;
        } else {
            return accountSession.currentPage;
        }
    }

    this.init = function(){
        if (landingPageContainer.length > 0) {

            //check for expiry
            hasUserSession();

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