(function(){

    var $ = jQuery,
        that = app.views.dashboard.upload,
        helpers = app.helpers,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass,
        dashboard = app.services.dashboard,
        animations = app.animations,
        fileUpload,
        uploadChecklistItemsClass = '.upload-checklist-item',
        fileUploadSubmitId = '#dashboard-upload-submit',
        fileUploadCancelId = '#dashboard-upload-cancel',
        fileUploadSelectId = '#dashboard-upload-select',
        progressBar,
        initialized = false;

    function initializeFileUpload(){
        var userSession = dashboard.getUserSession();
        fileUpload.fileupload({
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png|pdf|txt|doc|docx|csv|xls|xlsx|ppt|pptx|odt|ott)$/i,
            dataType: 'json',
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
                app.ajax.ajax(
                    'PUT',
                    '/dashboard/document',
                    {
                        action: 'api-dashboard-upload',
                        fileName: data.files[0].name,
                        checklistItemId: userSession.activeItem.checklistItemId
                    },
                    'json',
                    {  }
                )
                    .then(function(response){
                        $(fileUploadSubmitId).text('Upload finished').removeClass(disabledClass);
                        //todo, clear form and or refresh template
                        window.location.reload();
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        console.log(jqXHR,textStatus,errorThrown);
                        $(fileUploadSubmitId).removeClass(disabledClass);
                    });
            },
            cancel: function (e, data) {
                console.log(data);
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
            dashboard.refreshPage(userSession);
        }
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
            ;

            //functions
            initializeFileUpload();
        }
    };

}).apply(app.views.dashboard.upload);