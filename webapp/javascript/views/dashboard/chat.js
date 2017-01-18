(function(){

    var $ = jQuery,
        that = app.views.dashboard.chat,
        helpers = app.helpers,
        apiservice = app.apiservice,
        dashboard = app.services.dashboard,
        chatForm,
        chatSubmit,
        chatMessageInput,
        errorClass = app.helpers.errorClass,
        disabledClass = app.helpers.disabledClass;
    
    this.chatMessageReceived = false;

    function submitNewMessage(){
        if (!chatSubmit.hasClass(disabledClass)) {
            var formData = helpers.getFormData(chatForm);
            helpers.resetForm(chatForm);
            if (helpers.isEmpty(formData.message)) {
                chatMessageInput.addClass(errorClass);
            }
            if (!helpers.formHasErrors(chatForm)) {
                chatSubmit.addClass(disabledClass);

                apiservice.postMessages(userObject, formData.message)
                    .then(function(response){
                        that.chatMessageReceived = true;
                        dashboard.refreshPage();
                    })
                    .catch(function(jqXHR,textStatus,errorThrown){
                        console.log(jqXHR,textStatus,errorThrown);
                        chatSubmit.removeClass(disabledClass);
                    });
            }
        }
    }

    function markMessagesAsRead(){
        apiservice.markMessagesAsRead(userObject);
    }

    this.init = function(){
        if ($('#dashboard-chat').length > 0) {

            //variables
            chatForm = $('#dashboard-chat-form');
            chatSubmit = $('#dashboard-chat-submit');
            chatMessageInput = $('#dashboard-chat-message');

            if(scrollMessages) {
                $(".chat-message:last-child").velocity("scroll", {
                    container: $('#dashboard-chat-container'),
                    duration: 800,
                    delay: 250
                });
                scrollMessages = false;
            } else {
                $(".chat-message:last-child").velocity("scroll", {
                    container: $('#dashboard-chat-container'),
                    duration: 0
                });
            }

            //listeners
            chatForm.on('submit',function(event){
                event.preventDefault();
                submitNewMessage();
            });

            chatMessageInput.on('input propertychange', function() {
                markMessagesAsRead();
                $('#dashboard-chat-message-count').addClass(helpers.hiddenClass);
            });
        }
    };

}).apply(app.views.dashboard.chat);