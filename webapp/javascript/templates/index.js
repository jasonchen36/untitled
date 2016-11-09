(function(){

    var $ = jQuery,
        animations = app.animations,
        state = app.state,
        handlebarsContainer = $('#l--index-handlebars-data');//elements that are reused can be initialized here so that all functions can use them

    function loadHandlebarsData(){
        //create data
        var data = [];
        for (var i=0, t=10; i<t; i++) {
            data.push(Math.round(Math.random() * t));
        }
        
        //populate html with data
        var list = {
                list: data
            },
            template = Handlebars.templates.list,
            html = template(list);
        
        setTimeout(function(){
            //wait to emulate ajax or add suspense
            animations.fadeOut(handlebarsContainer)
                .then(function(){
                    //^use the promisified animation methods
                    handlebarsContainer.html(html);//set hbs template as html content
                    animations.fadeIn(handlebarsContainer);
                });
        }, 3000);
    }

    function loadUserState(){
        state.getUserState()
            .then(function(user){
                $('#l--user-cookie').html(moment(user.expires).format("dddd, MMMM Do YYYY, hh:mm:ss a"));
            });
    }

    this.init = function(){
        //fade in elements
        animations.fadeIn($('.a--fade-in-on-load'));

        //load hbs data
        loadHandlebarsData();

        //load cookie and momentjs
        loadUserState();
    };

}).apply(app.templates.index);