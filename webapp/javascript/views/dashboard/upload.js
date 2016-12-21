(function(){

    var $ = jQuery,
        that = app.views.dashboard.upload,
        helpers = app.helpers,
        apiservice = app.apiservice, 
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass,
        dashboard = app.services.dashboard,
        animations = app.animations,
        fileUpload,
        uploadChecklistItemsClass = '.upload-checklist-item',
        fileUploadSubmitId = '#dashboard-upload-submit',
        fileUploadCancelId = '#dashboard-upload-cancel',
        fileUploadSelectId = '#dashboard-upload-select',
        documentTile = '#container-document-tile',
        buttonClosePreview = '#button-close-preview',
        progressBar,
        initialized = false;

    function initializeFileUpload(){
        var userSession = dashboard.getUserSession();
        fileUpload.fileupload({
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png|pdf|txt|doc|docx|csv|xls|xlsx|ppt|pptx|odt|ott)$/i,
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer '+ userSession.token
            },
            add: function (e, data) {
                // console.log(data.originalFiles[0].name);
                $(fileUploadSubmitId).removeClass(disabledClass);
                data.context = $(fileUploadSubmitId)
                    .click(function () {
                        data.context = $(fileUploadSubmitId).text('Uploading...');
                        $(fileUploadCancelId).removeClass(disabledClass);
                        $(fileUploadSubmitId).addClass(disabledClass);
                        data.submit();
                    });
            },
            done: function (e, data) {

                app.services.dashboard.refreshPage();
            },
            cancel: function (e, data) {
                //console.log(data);
            },
            progressall: function (e, data) {
                var percentageComplete = parseInt(data.loaded / data.total * 100, 10);
                animations.animateElement(progressBar,{
                    properties: {
                        width: percentageComplete+'%'
                    }
                });
            }
        });
    }

    function setActiveItem(dataId){
        var userSession = dashboard.getUserSession();
        userSession.isPreview = "";
        if(userSession.hasOwnProperty('activeItem') || userSession.activeItem !== dataId) {
            if (dataId === 0) {
                //additional documents
                userSession.activeItem = {
                    name: 'Additional Documents',
                    checklistItemId: 0
                };
            } else {
                userSession.activeItem = _.find(userSession.documentChecklist.checklistItems, ['checklistItemId', dataId]);
            }
            console.log("Usersession",userSession);
            dashboard.refreshPage(userSession);

        }
    }

    function previewDocument(documentId, checklistId){
        var userSession = dashboard.getUserSession();
        var activeItem = _.find(userSession.documentChecklist.checklistItems, ['checklistItemId', checklistId]);
        userSession.documentItem = _.find(activeItem.documents, ['documentId', documentId]);
        userSession.isPreview = "true";
        dashboard.refreshPage(userSession);
    }

    function closePreview(){
        var userSession = dashboard.getUserSession();
        userSession.isPreview = "";
        dashboard.refreshPage(userSession);
    }

    this.init = function(){
        if ($('#dashboard-upload').length > 0) {
            //set initial active item
            if (!initialized){
                initialized = true;
                if (dashboard.getUserSession().documentChecklist.checklistItems.length > 0){
                    setActiveItem(dashboard.getUserSession().documentChecklist.checklistItems[0].checklistItemId);
                }
            }

            //variables
            fileUpload = $('#dashboard-upload-input');
            progressBar = $('#dashboard-upload-progress');

            //listeners
            $(document)
                .off('click', uploadChecklistItemsClass)
                .on('click', uploadChecklistItemsClass, function (event) {
                    event.preventDefault();
                    setActiveItem(parseInt($(this).attr('data-id')));
                })
                .off('click', fileUploadCancelId)
                .on('click', fileUploadCancelId, function (event) {
                    event.preventDefault();
                    fileUpload.abort();
                    $(fileUploadCancelId).addClass(disabledClass);
                    $(fileUploadSubmitId).removeClass(disabledClass);
                })
                .off('click', fileUploadSelectId)
                .on('click', fileUploadSelectId, function (event) {
                    event.preventDefault();
                    fileUpload.click();
                })
                .off('click', fileUploadSubmitId)
                .on('click', fileUploadSubmitId, function (event) {
                    event.preventDefault();
                })
                .off('click', documentTile)
                .on('click', documentTile, function (event) {
                    event.preventDefault();
                    previewDocument(parseInt($(this).attr('data-id')), parseInt($(this).attr('active-item-id')));
                })
                .off('click', buttonClosePreview)
                .on('click', buttonClosePreview, function (event) {
                    event.preventDefault();
                    closePreview();
                })
            ;

            //functions
            initializeFileUpload();
        }
    };

}).apply(app.views.dashboard.upload);