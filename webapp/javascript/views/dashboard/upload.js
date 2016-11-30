(function(){

    var $ = jQuery,
        that = app.views.dashboard.upload,
        helpers = app.helpers,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass,
        fileUpload,
        progressBar;

    function initializeFileUpload(){
        fileUpload.fileupload({
            dataType: 'json',
            add: function (e, data) {
                data.context = $('<button/>').text('Upload')
                    .appendTo(document.body)
                    .click(function () {
                        data.context = $('<p/>').text('Uploading...').replaceAll($(this));
                        data.submit();
                    });
            },
            done: function (e, data) {
                data.context.text('Upload finished.');
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
            fileUpload = $('#fileupload');
            progressBar = $('#progress-bar');

            //functions
            initializeFileUpload();
        }
    };

}).apply(app.views.dashboard.upload);