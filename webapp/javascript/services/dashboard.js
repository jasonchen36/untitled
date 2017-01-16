
(function(){

    /* *************** variables ***************/
    var $ = jQuery,
        that = app.services.dashboard,
        apiservice = app.apiservice,
        cookies = app.cookies,
        userSessionStore,
        helpers = app.helpers,
        chat = app.views.dashboard.chat,
        activeClass = helpers.activeClass,
        checklist,
        activeItemId = 0,
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
        } else {cookies.setCookie(dashboardStateCookie, {
                currentPage: that.dashboardOrder[0]
            });
            return that.dashboardOrder[0];
        }
    }

    function changePageHelper(pageName){
        if (getCurrentPage() !== pageName) {
            if(pageName == 'chat')  {
                changePageChat();
            } else if(pageName == 'upload')  {
               changePageUpload();
            }  else  {
                that.changePage(pageName);
            }
        }
    }

    function changePageChat(){
        apiservice.getMessages(userObject)
            .then(function(response){

                var dataObject = that.getUserSession();
                dataObject.newMessageCount = 0;
                dataObject.messages  = [];

                var today = moment();
                var foundToday = false;
                var pattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
                 response.messages.forEach(function(entry){

                    dataObject.messages.push(getChatMessageObject(entry));

                 });

                    for (var i = 0, len = dataObject.messages.length; i < len; i++) {
                        //count unread messages
                        if(dataObject.messages[i].status.toLowerCase() === 'new' &&
                            dataObject.messages[i].isFromUser !== true){
                            dataObject.newMessageCount++;
                        }

                        //today header
                        if(moment(dataObject.messages[i].rawDate).month() === moment(today).month() &&
                            moment(today).date() === moment(dataObject.messages[i].rawDate).date() &&
                            foundToday === false){
                            dataObject.messages[i].isFirst = true;
                            foundToday = true;
                        }

                        //check for link
                        if(pattern.test(dataObject.messages[i].body)){
                            dataObject.messages[i].replacedBody = dataObject.messages[i].body.replace(pattern, function(url){
                                return '<a href="' + url + '">' + url + '</a>';
                            });
                        } else {
                            dataObject.messages[i].replacedBody = dataObject.messages[i].body;
                        }
                    }

                if(chat.chatMessageReceived){
                    chat.chatMessageReceived = false;
                    dataObject.messages.push(getChatMessageObject({
                        body: 'Your message has been received',//todo, use real copy text
                        client_id: 0,
                        date: moment.now(),
                        from_id: 32,
                        from_role: 'TAXPlan',
                        fromname: 'TAXPlan',
                        id: 0,
                        status: 'read',
                        subject: ''
                    }));
                }

                dataObject.notUploaded = true;
                that.changePage('chat', dataObject);
            })
            .catch(function(jqXHR,textStatus,errorThrown){
                console.log(jqXHR,textStatus,errorThrown);

            });
    }


    function changePageUpload(){
        apiservice.getChecklist(userObject)
            .then(function(response){
                var dataObject = that.getUserSession();
                dataObject.documentChecklist = getDocumentChecklistObject(response);
                dataObject.currentPage= "upload";
                that.checklist = dataObject.documentChecklist;


                if (that.activeItemId === 0) {
                   //additional documents
                   dataObject.activeItem = {
                       name: 'Additional Documents',
                       checklistItemId: 0,
                       documents: userSession.documentChecklist.additionalDocuments
                   };
                }
                else {

                    dataObject.activeItem = _.find(that.checklist.checklistItems, ['checklistItemId', that.activeItemId]);
                }

                if(typeof dataObject.notUploaded === 'undefined' || dataObject.notUploaded === '' ) {
                    dataObject.notUploaded = true;
                }
                that.changePage('upload', dataObject);
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
            isFirst: false,
            replacedBody: "default"
        };
    }



    function getDocumentChecklistFilerName(data){

        var name = data.first_name;
        if(data.last_name !== null)  {
            name =  name + " " + data.last_name;
        }

        return {
            name: name
       };
    }



    function getDocumentChecklistItemObject(data){
        return {
            checklistItemId: data.checklist_item_id,
            name: data.name,
            documents: data.documents,
            filers: _.map(data.filers, getDocumentChecklistFilerName)
        };
    }


    function getDocumentChecklistObject(data){
        return {
            checklistItems: _.map(data.checklistitems, getDocumentChecklistItemObject),
         //   additionalDocuments: data.additionalDocuments
        };
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
        if(typeof data !== 'object'){
            data = that.getUserSession();
        }
        //update session with new data
        updateUserSession(data);

        newPage = that.dashboardOrder[currentPageIndex];

        if(newPage == 'chat')  {
            changePageChat();
        } else if(newPage == 'upload')  {
           changePageUpload();
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
                    changePageHelper('chat');
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
                })
                .on('click', '#dashboard-get-the-app', function (event) {
                    event.preventDefault();
                    //todo, put in real url
                    window.location.href = '#get-the-app';
                });

            var userSession = startUserSession();
            apiservice.getTaxReturns(userSession)
                .then(function(data) {
                    userSession.taxReturns = data;
                    // functions
                    that.refreshPage(userSession);
                });
        }
    };

}).apply(app.services.dashboard);
