
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
        'my-return',
        'settings'
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
        dashboardViews.settings.init();
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
            }else if(pageName == 'settings')  {
                changePageSettings();
            }
            else  {
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
                var foundSentToday = false;
                var pattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
                 response.messages.forEach(function(entry){
                     var chatObject = getChatMessageObject(entry);
                    if(chatObject.isFromTaxPro){
                        _.each(dataObject.taxPros.taxPros, function(taxPro){
                            if(taxPro.id === chatObject.fromId){
                                chatObject.taxProName = taxPro.first_name;
                                chatObject.taxProPic = taxPro.taxpro_pic;
                            }
                        });
                    }

                    dataObject.messages.push(chatObject);

                 });

                    for (var i = 0; i < dataObject.messages.length; i++) {
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

                        // insert message received response for today's date on first message from user
                        if(moment(dataObject.messages[i].rawDate).month() === moment(today).month() &&
                            moment(today).date() === moment(dataObject.messages[i].rawDate).date() &&
                            foundToday === true && foundSentToday === false && dataObject.messages[i].isFromUser === true){

                            var receivedMessage =  {
                                body: "Your message has been received, your TAXpro will respond within 24hrs or the next business day",
                                client_id: 1,
                                date: dataObject.messages[i].date,
                                from_id: 0,
                                from_role: 'TAXPlan',
                                fromname: 'TAXPlan',
                                id: 0,
                                status: 'read',
                                subject: '',
                                replacedBody: 'Your message has been received'
                            };

                            dataObject.messages.splice(i + 1, 0, receivedMessage);
                            foundSentToday = true;
                        }

                        //check for link
                        if(pattern.test(dataObject.messages[i].body)){
                            dataObject.messages[i].replacedBody = dataObject.messages[i].body.replace(pattern, function(url){
                                return '<a href="' + url + '" target="_blank">' + url + '</a>';
                            });
                        } else {
                            dataObject.messages[i].replacedBody = dataObject.messages[i].body;
                        }
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
                       documents: that.checklist.additionalDocuments
                   };
                }
                else {

                    dataObject.activeItem = _.find(that.checklist.checklistItems, ['checklistItemId', that.activeItemId]);

                }

                if(typeof dataObject.activeItem !== 'undefined') {
                    var canDelete = true;
                    if(dataObject.taxReturns[0].status.id >= 4)  {
                       canDelete = false;
                    }

                    var jpegPattern = /.+\.(jpg|png|JPG|PNG)/;
                    var textPattern = /.+\.(pdf|txt|doc|docx|PDF|TXT|DOC|DOCX)/;

                    if(typeof dataObject.activeItem.documents !== 'undefined')
                    dataObject.activeItem.documents.forEach(function(entry) {
                        entry.hideDelete = !canDelete;
                        if(entry.thumbnailUrl.match(jpegPattern) !== null){
                            entry.hasDocThumbnail = true;
                        }else if(entry.thumbnailUrl.match(textPattern) !== null){
                            entry.isTextDoc = true;
                        }else{
                            entry.isOtherDoc = true;
                        }
                    });
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

        var LOCAL_TIMEZONE = 'America/Toronto';

        return {
            status: data.status,
            body: data.body,
            subject: data.subject,
            clientId: data.client_id,
            fromName: data.fromname,
            fromId: data.from_id,
            rawDate: moment(data.date,'MM/DD/YY hh:mm A'),
            date: moment.utc(data.date, 'MM/DD/YY hh:mm A').tz(LOCAL_TIMEZONE).format('MMM D [-] h:mm A'),
            isFromUser: data.client_id === data.from_id,
            isFromTaxPro: data.from_role === 'Tax Pro' || data.from_role === 'TaxPro', //todo is this the final role name?
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
            description: data.description,
            filers: _.map(data.filers, getDocumentChecklistFilerName)
        };
    }


    function getDocumentChecklistObject(data){
        return {
            checklistItems: _.map(data.checklistitems, getDocumentChecklistItemObject),
            additionalDocuments: data.additionalDocuments
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
        } else if(newPage == 'settings'){
            changePageSettings();
        } else  {
            that.changePage(newPage);
        }

    };

    this.getUserSession = function(){
        return userSessionStore;
    };


    function updateMessages(){

        var currentPage = getCurrentPage();

        if(currentPage == 'chat') {

            changePageChat();
        }
    }

    function changePageSettings() {
        var dataObject = that.getUserSession();
        dataObject.currentPage = "settings";
        that.changePage('settings', dataObject);
    }

    this.init = function(){
        if (landingPageContainer.length > 0) {

            $('#header-settings').show();

            //shared bindings
            $(document)
                .on('click', '#dashboard-upload-activate', function (event) {
                    event.preventDefault();
                    changePageHelper('upload');
                    $(this).addClass(activeClass);
                    document.getElementById('dashboard-chat-activate').classList.remove('active');
                    document.getElementById('dashboard-my-return-activate').classList.remove('active');
                })
                .on('click', '#dashboard-chat-activate', function (event) {
                    event.preventDefault();
                    changePageHelper('chat');
                    $(this).addClass(activeClass);
                    document.getElementById('dashboard-upload-activate').classList.remove('active');
                    document.getElementById('dashboard-my-return-activate').classList.remove('active');
                })
                .on('click', '#dashboard-my-return-activate', function (event) {
                    event.preventDefault();
                    changePageHelper('my-return');
                    $(this).addClass(activeClass);
                    document.getElementById('dashboard-chat-activate').classList.remove('active');
                    document.getElementById('dashboard-upload-activate').classList.remove('active');
                })
                .on('click', '#header-settings', function(event){
                    event.preventDefault();
                    changePageHelper('settings');
                })
                .on('click', '#settings-cancel', function(event){
                    event.preventDefault();
                    changePageHelper('chat');
                    document.getElementById('dashboard-upload-activate').classList.remove('active');
                    document.getElementById('dashboard-my-return-activate').classList.remove('active');
                    document.getElementById('dashboard-chat-activate').classList.add('active');
                });
            var userSession = startUserSession();
            apiservice.getAllTaxpros(userSession).then(function(taxpros) {
                apiservice.getTaxReturns(userSession)
                    .then(function (data) {
                        userSession.taxReturns = data;
                        userSession.taxPros = taxpros;
                        // functions
                        that.refreshPage(userSession);
                    });

                setInterval(function () {
                    updateMessages();
                }, 180000);
            });
        }
    };

}).apply(app.services.dashboard);
