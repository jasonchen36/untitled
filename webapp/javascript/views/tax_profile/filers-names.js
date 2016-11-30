(function(){

    var $ = jQuery,
        that = app.views.taxProfile.filersNames,
        helpers = app.helpers,
        taxProfile = app.services.taxProfile,
        filtersNamesForm,
        filtersNamesSubmit,
        filtersNamesBack,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitIncome(){
        //todo
        taxProfile.goToNextPage();
    }

    this.init = function(){
        if ($('#tax-profile-filers-names').length > 0) {

            //variables
            filtersNamesForm = $('#filers-names-form');
            filtersNamesSubmit = $('#filers-names-submit');
            filtersNamesBack = $('#filers-names-back');

            //listeners
            filtersNamesForm.on('submit',function(event){
                event.preventDefault();
                submitIncome();
            });

            filtersNamesSubmit.on('click',function(event){
                event.preventDefault();
                submitIncome();
            });

            filtersNamesBack.on('click',function(event){
                event.preventDefault();
                taxProfile.goToPreviousPage();
            });
        }
    };

}).apply(app.views.taxProfile.filersNames);