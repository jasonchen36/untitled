(function(){

    var $ = jQuery,
        that = app.views.taxProfile.income,
        helpers = app.helpers,
        taxProfile = app.services.taxProfile,
        incomeForm,
        incomeSubmit,
        incomeBack,
        activeClass = helpers.activeClass,
        errorClass = helpers.errorClass,
        disabledClass = helpers.disabledClass;

    function submitIncome(){
        if (!incomeSubmit.hasClass(disabledClass)) {
            var formData = helpers.getTileFormData(incomeForm);
            if(!helpers.hasSelectedTile(formData)){
                //todo, real alert
                alert('no selected option');
            } else {
                incomeSubmit.addClass(disabledClass);
                app.ajax.ajax(
                    'POST',
                    '/tax-profile',
                    {
                        action: 'api-tp-income',
                        data: formData
                    },
                    'json'
                )
                    .then(function(response){
                        taxProfile.goToNextPage(response.data);
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        console.log(jqXHR,textStatus,errorThrown);
                        incomeSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    this.init = function(){
        if ($('#tax-profile-income').length > 0) {

            //variables
            incomeForm = $('#income-form');
            incomeSubmit = $('#income-submit');
            incomeBack = $('#income-back');

            //listeners
            incomeForm.on('submit',function(event){
                event.preventDefault();
                submitIncome();
            });

            incomeSubmit.on('click',function(event){
                event.preventDefault();
                submitIncome();
            });

            incomeBack.on('click',function(event){
                event.preventDefault();
                taxProfile.goToPreviousPage();
            });
        }
    };

}).apply(app.views.taxProfile.income);