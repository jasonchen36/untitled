(function(){

    var $ = jQuery,
        that = app.views.personalProfile.address,
        helpers = app.helpers,
        personalProfile = app.services.personalProfile,
        addressForm,
        addressSubmit,
        addressBack,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitAddress(){
        //todo
        personalProfile.goToNextPage();
    }

    this.init = function(){
        if ($('#personal-profile-address').length > 0) {

            //variables
            addressForm = $('#address-form');
            addressSubmit = $('#address-submit');
            addressBack = $('#address-back');

            //listeners
            addressForm.on('submit',function(event){
                event.preventDefault();
                submitAddress();
            });

            addressSubmit.on('click',function(event){
                event.preventDefault();
                submitAddress();
            });

            addressBack.on('click',function(event){
                event.preventDefault();
                personalProfile.goToPreviousPage();
            });
        }
    };

}).apply(app.views.personalProfile.address);