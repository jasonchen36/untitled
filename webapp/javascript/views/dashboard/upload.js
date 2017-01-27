(function(){

    var $ = jQuery,
        that = app.views.dashboard.upload,
        helpers = app.helpers,
        apiservice = app.apiservice,
        disabledClass = helpers.disabledClass,
        dashboard = app.services.dashboard,
        animations = app.animations,
        ajax = app.ajax,
        fileUpload,
        uploadChecklistItemsClass = '.upload-checklist-item',
        fileUploadSubmitId = '#dashboard-upload-submit',
        fileUploadCancelId = '#dashboard-upload-cancel',
        fileUploadSelectId = '#dashboard-upload-select',
        documentTile = '#container-document-tile',
        buttonClosePreview = '#button-close-preview',
        buttonDeleteFile = '.dashboard-upload-delete',
        taxReturnSubmit,
        taxReturnForm,
        progressBar,
        fileUploadSuccess,
        deleteFileForm,
        currentDeleteFileElement,
        buttonChecklistDescription,
        errorClass = helpers.errorClass,
        hiddenClass = helpers.hiddenClass,
        initialized = false;

    function initializeFileUpload(){
        var userSession = dashboard.getUserSession();
        fileUpload.fileupload({
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png|pdf|txt|doc|docx|csv|xls|xlsx|ppt|pptx|odt|ott)$/i,
            headers: {
                'Authorization': 'Bearer '+ userSession.token
            },
            add: function (e, data) {
                $(fileUploadSelectId).addClass(hiddenClass);

                data.context = $(fileUploadSubmitId).text('Uploading...');
                        $(fileUploadCancelId).removeClass(hiddenClass);
                        $(fileUploadSelectId).addClass(hiddenClass);
                        data.submit();
            },
            done: function (e, data) {
                resetUploadForm();
                userSession.notUploaded = false;
                dashboard.refreshPage(userSession);

            },
            fail: function (e, data) {
                resetUploadForm();
                //todo, make pretty error
                alert('error');
            },
            cancel: function (e, data) {
                resetUploadForm();
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

    function resetUploadForm(){
        $(fileUploadCancelId).addClass(hiddenClass);
        $(fileUploadSelectId).removeClass(hiddenClass);
        progressBar.css({width:0});
    }

    function setActiveItem(dataId){
        var userSession = dashboard.getUserSession();
        userSession.isPreview = "";

        if(dashboard.hasOwnProperty('activeItem') || dashboard.activeItemId !== dataId) {
            dashboard.activeItemId = dataId;
            dashboard.refreshPage(userSession);
        }

        $("#upload-checklist-item-"+dataId).addClass(helpers.activeClass);
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

    function confirmReturnSubmission(){
        window.location.hash = 'modal-tax-return-submit';
    }

    function showChecklistDescriptionModal(){
        window.location.hash = 'modal-checklist-description';
    }

    function submitReturn(){     

        apiservice.submitReturn(userObject, userObject.quoteId)
            .then(function(data){
                userObject.taxReturns[0].status.id = 5;
                window.location.hash = '!';
                dashboard.changePage('my-return');
            })
            .catch(function(jqXHR,textStatus,errorThrown){
                //todo, error message
                console.log(jqXHR,textStatus,errorThrown);
                window.location.hash = '!';
            });
    }

    function confirmDeleteFile(element){
        currentDeleteFileElement = element;
        window.location.hash = 'modal-delete-file-submit';
    }

    function deleteFileById(){
        var userSession = dashboard.getUserSession(),
            documentId = currentDeleteFileElement.attr('data-id'),
            quoteId = currentDeleteFileElement.attr('data-quote-id');

            apiservice.deleteDocument(userSession, quoteId, documentId)
                .then(function() {
                window.location.hash = '!';
                window.location.reload();
            })
            .catch(function(jqXHR,textStatus,errorThrown){
                //todo, error message
                console.log(jqXHR,textStatus,errorThrown);
                window.location.hash = '!';
            });
    }

    function downloadPdfChecklist(){

 
        var anchor = $('.document-checklist-pd');
        apiservice.getPdfChecklist(userObject,
                         "Checklist.pdf")
            .then(function() {
              
                // todo

            })
            .catch(function(jqXHR,textStatus,errorThrown){
                //todo, error message
                console.log(jqXHR,textStatus,errorThrown);
                window.location.hash = '!';
            });
    }


    this.init = function(){

        if ($('#dashboard-upload').length > 0) {
            //set initial active item
            if (!initialized){
                initialized = true;
                setActiveItem(null);
            }

            //variables
            fileUpload = $('#dashboard-upload-input');
            progressBar = $('#dashboard-upload-progress');
            taxReturnSubmit = $('#tax-return-submit');
            documentChecklistPdf = $('#document-checklist-pdf');
            taxReturnForm = $('#modal-tax-return-submit-form');
            fileUploadSuccess = $('#dashboard-upload-success');
            deleteFileForm = $('#modal-delete-file-submit-form');
            buttonChecklistDescription = $('#upload-checklist-item-info-button');
            var userSession = dashboard.getUserSession();

            //listeners
            taxReturnSubmit.on('click',function(event){
                event.preventDefault();
                confirmReturnSubmission();
            });

            taxReturnForm.on('submit',function(event){
                event.preventDefault();
                submitReturn();
            });

            deleteFileForm.on('submit',function(event){
                event.preventDefault();
                deleteFileById();
            });

            documentChecklistPdf.on('click',function(event){
                event.preventDefault();
                downloadPdfChecklist();
            });

            buttonChecklistDescription.on('click',function(event){
                event.preventDefault();
                showChecklistDescriptionModal();
            });

            $(document)
                .off('click', uploadChecklistItemsClass)
                .on('click', uploadChecklistItemsClass, function (event) {
                    event.preventDefault();
                    userSession.notUploaded = true;
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
                    userSession.notUploaded = true;
                    fileUpload.click();
                })
                .off('click', fileUploadSubmitId)
                .on('click', fileUploadSubmitId, function (event) {
                    event.preventDefault();
                })
                .off('click', documentTile)
                .on('click', documentTile, function (event) {
                    event.preventDefault();
                    previewDocument(parseInt($(this).attr('data-id')), parseInt($(this).attr('data-active-item-id')));
                })
                .off('click', buttonClosePreview)
                .on('click', buttonClosePreview, function (event) {
                    event.preventDefault();
                    closePreview();
                })
                .off('click', buttonDeleteFile)
                .on('click', buttonDeleteFile, function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    confirmDeleteFile($(this));
                })
                .on('dragover', '#dashboard-upload-form', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $('#dashboard-upload-form').addClass('hover');
                })
                .on('dragleave', '#dashboard-upload-form', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $('#dashboard-upload-form').removeClass('hover');
                });

            //functions
            initializeFileUpload();
        }
    };

}).apply(app.views.dashboard.upload);