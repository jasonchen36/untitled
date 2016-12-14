(function(){

    var $ = jQuery,
        that = app.views.dashboard.upload,
        helpers = app.helpers,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass,
        dashboard = app.services.dashboard,
        fileUpload,
        fileUploadSubmit,
        fileUploadCancel,
        fileUploadSelect,
        uploadChecklistItems,
        progressBar,
        activeItem,
        initialized = false;

    function initializeFileUpload(){
        fileUpload.fileupload({
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png|pdf|txt|doc|docx|csv|xls|xlsx|ppt|pptx|odt|ott)$/i,
            dataType: 'json',
            add: function (e, data) {
                // console.log(data.originalFiles[0].name);
                fileUploadSubmit.removeClass(disabledClass);
                data.context = fileUploadSubmit
                    .click(function () {
                        data.context = fileUploadSubmit.text('Uploading...');
                        fileUploadCancel.removeClass(disabledClass);
                        fileUploadSubmit.addClass(disabledClass);
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
                        checklistItemId: activeItem.checklistItemId
                    },
                    'json'
                )
                    .then(function(response){
                        fileUploadSubmit.text('Upload finished').removeClass(disabledClass);
                        //todo, clear form and or refresh template
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        console.log(jqXHR,textStatus,errorThrown);
                        fileUploadSubmit.removeClass(disabledClass);
                    });
            },
            cancel: function (e, data) {
                console.log(data);
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                progressBar.text(progress + '%');
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
                setActiveItem(dashboard.getUserSession().documentChecklist.checklistItems[0].checklistItemId);
            }

            //variables
            fileUpload = $('#dashboard-upload-input');
            progressBar = $('#dashboard-upload-progress');
            fileUploadCancel = $('#dashboard-upload-cancel');
            fileUploadSubmit = $('#dashboard-upload-submit');
            fileUploadSelect = $('#dashboard-upload-select');
            uploadChecklistItems = $('.upload-checklist-item');

            //listeners
            fileUploadSubmit.on('click', function (event) {
                event.preventDefault();
            });

            fileUploadCancel.on('click', function (event) {
                event.preventDefault();
                fileUpload.abort();
                fileUploadCancel.addClass(disabledClass);
                fileUploadSubmit.removeClass(disabledClass);
            });

            fileUploadSelect.on('click',function(event){
                event.preventDefault();
                fileUpload.click();
            });

            uploadChecklistItems.on('click',function(event){
                event.preventDefault();
                setActiveItem(parseInt($(this).attr('data-id')));
            });

            //functions
            initializeFileUpload();
        }
    };

}).apply(app.views.dashboard.upload);