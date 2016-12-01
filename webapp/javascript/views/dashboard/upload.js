(function(){

    var $ = jQuery,
        that = app.views.dashboard.upload,
        helpers = app.helpers,
        animations = app.animations,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass,
        fileUpload,
        fileUploadSubmit,
        fileUploadCancel,
        fileUploadSelect,
        progressBar;

    function initializeFileUpload(){
        fileUpload.fileupload({
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png|pdf|txt|doc|docx|csv|xls|xlsx|ppt|pptx|odt|ott)$/i,
            dataType: 'json',
            add: function (e, data) {
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
                fileUploadSubmit.text('Upload finished').addClass(disabledClass);
                //todo, clear form and or refresh template
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

    this.init = function(){
        if ($('#dashboard-upload').length > 0) {
            //variables
            fileUpload = $('#dashboard-upload-input');
            progressBar = $('#dashboard-upload-progress');
            fileUploadCancel = $('#dashboard-upload-cancel');
            fileUploadSubmit = $('#dashboard-upload-submit');
            fileUploadSelect = $('#dashboard-upload-select');

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

            //functions
            initializeFileUpload();
        }
    };

}).apply(app.views.dashboard.upload);