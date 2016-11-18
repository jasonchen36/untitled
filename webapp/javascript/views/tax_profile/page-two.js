(function(){

    var $ = jQuery,
        that = app.views.profile.pageTwo,
        helpers = app.helpers,
        pageTwoForm = $('#profile-2-form'),
        pageTwoSubmit = $('#profile-2-submit'),
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitPageTwo(){
        if (!pageTwoSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormData(pageTwoForm);
            helpers.resetForm(pageTwoForm);
            if (!helpers.hasCheckedCheckboxes(formData)){
                alert('no selected option');
            } else {
                pageTwoSubmit.addClass(disabledClass);
                app.ajax.ajax(
                    'POST',
                    '/tax-profile/2',
                    {
                        myself: formData.myself,
                        spouse: formData.spouse,
                        other: formData.other
                    },
                    'json'
                )
                    .then(function(){
                        window.location.href = '/tax-profile/3';
                    })
                    .catch(function(){
                        alert('error');
                        pageTwoSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    this.init = function(){
        if ($('#page-profile-2').length > 0) {

            //listeners
            pageTwoForm.on('submit',function(event){
                event.preventDefault();
                submitPageTwo();
            });
        }
    };

}).apply(app.views.profile.pageTwo);