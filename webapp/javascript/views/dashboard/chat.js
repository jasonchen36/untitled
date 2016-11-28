(function(){

    var $ = jQuery,
        that = app.views.dashboard.chat,
        helpers = app.helpers,
        chatForm,
        chatSubmit,
        chatMessageInput,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;

    function submitNewMessage(){
        if (!chatSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormData(chatForm);
            helpers.resetForm(chatForm);
            if (helpers.isEmpty(formData.message)) {
                chatMessageInput.addClass(errorClass);
            }
            if (!helpers.formHasErrors(chatForm)) {
                chatSubmit.addClass(disabledClass);
                app.ajax.ajax(
                    'PUT',
                    '/dashboard/chat',
                    {
                        action: 'api-dashboard-chat',
                        message: formData.message
                    },
                    'json'
                )
                    .then(function(response){
                        //todo, show success and refresh?
                        window.location.reload();
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        console.log(jqXHR,textStatus,errorThrown);
                        chatSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    this.init = function(){
        if ($('#dashboard-chat').length > 0) {

            console.log('init');
            
            //variables
            chatForm = $('#dashboard-chat-form');
            chatSubmit = $('#dashboard-chat-submit');
            chatMessageInput = $('#dashboard-chat-message');

            //listeners
            chatForm.on('submit',function(event){
                event.preventDefault();
                submitNewMessage();
            });
        }
    };

}).apply(app.views.dashboard.chat);