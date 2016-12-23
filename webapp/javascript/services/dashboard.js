
(function(){

    /* *************** variables ***************/
    var $ = jQuery,
        that = app.services.dashboard,
        apiservice = app.apiservice, 
        cookies = app.cookies,
        userSessionStore,
        helpers = app.helpers,
        activeClass = helpers.activeClass,
        landingPageContainer = $('#dashboard-container'),
        dashboardStateCookie = 'store-dashboard-state';

    this.dashboardOrder = [
        'chat',
        'upload',
        'my-return'
    ];


    /* *************** private methods ***************/


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

    function changePageChat(){

      
        apiservice.getMessages(userObject)
            .then(function(response){

                var dataObject = {};
                dataObject.newMessageCount = 0;
                dataObject.messages  = [];

                var today = moment();
                var foundToday = false;
                response.messages.forEach(function(entry){

                    dataObject.messages.push(getChatMessageObject(entry));

                    //count unread messages
                    if(entry.status.toLowerCase() === 'new'){
                        dataObject.newMessageCount++;
                    }
                    if(moment(entry.rawDate).month() === moment(today).month() &&
                        moment(today).date() === moment(entry.rawDate).date() &&
                        foundToday === false){
                        entry.isFirst = true;
                        foundToday = true;
                    }
                });

                that.changePage('chat', dataObject);
            })
            .catch(function(jqXHR,textStatus,errorThrown){
                console.log(jqXHR,textStatus,errorThrown);

            });
    }


    function getChatMessageObject(data){


        return {
            status: data.status,
            body: data.body,
            subject: data.subject,
            clientId: data.client_id,
            fromName: data.fromname,
            fromId: data.from_id,
            rawDate: moment(data.date),
            date: moment(data.date).format('MMM D [-] h:mm A').toString(),
            isFromUser: data.client_id === data.from_id,
            isFromTaxPro: data.from_role === 'Tax Pro', //todo is this the final role name?
            isFromTaxPlan: data.from_role === 'TAXPlan', // todo is this the final role name?  
            isFirst: false
        };
    }





    /* *************** public methods ***************/
    this.changePage = function(newPage, data){
        return new Promise(function (resolve, reject) {
            if(typeof data !== 'object'){
                data = that.getUserSession();
            }
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

        newPage = that.dashboardOrder[currentPageIndex];

        if(newPage == 'chat')  {
            changePageChat();
        }  else  {
            that.changePage(newPage);
        }

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
                    $(this).addClass(activeClass);
                    document.getElementById('dashboard-chat-activate').classList.remove('active');
                    var startMyReturn = document.getElementById('dashboard-my-return-activate');
                    if(startMyReturn) {
                        startMyReturn.classList.remove('active');
                    }
                })
                .on('click', '#dashboard-chat-activate', function (event) {
                    event.preventDefault();
                    changePageChat();
                    $(this).addClass(activeClass);
                    document.getElementById('dashboard-upload-activate').classList.remove('active');
                    var startMyReturn = document.getElementById('dashboard-my-return-activate');
                    if(startMyReturn) {
                        startMyReturn.classList.remove('active');
                    }
                })
                .on('click', '#dashboard-my-return-activate', function (event) {
                    event.preventDefault();
                    changePageHelper('my-return');
                    $(this).addClass(activeClass);
                    document.getElementById('dashboard-chat-activate').classList.remove('active');
                    document.getElementById('dashboard-upload-activate').classList.remove('active');
                });

            //functions
            that.refreshPage();
        }
    };

}).apply(app.services.dashboard);