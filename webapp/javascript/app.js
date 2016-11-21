/*

 this follows the namespacing pattern listed here https://addyosmani.com/blog/essential-js-namespacing/

 */

var app = {

    //services
    ajax: {},
    animations: {},
    cookies: {},
    handlebars: {},
    helpers: {},
    state: {},
    mediaQueries: {},
    services: {
      taxProfile: {}  
    },

    //modules
    carousel: {},

    //templates
    views: {
        taxProfile: {
            welcome: {},
            filingFor: {}
        },
        user: {
            login: {},
            register: {},
            passwordReset: {},
            authorizedPasswordReset: {}
        }
    },

    //functions
    init: function(){
        var cookies = app.cookies,
            carousel = app.carousel,
            views = app.views;


        //services
        if (!cookies.areCookiesEnabled()) {
            alert('Cookies are not supported by your browser. Please disable "Private Mode" or upgrade to a modern browser in order to use this website.');
        }
        app.handlebars.applyHelpers();


        //modules
        if (carousel.hasCarousels()){
            carousel.init();
        }
        
        //views
        views.user.login.init();
        views.user.register.init();
        views.user.passwordReset.init();
        views.user.authorizedPasswordReset.init();

        //tax profile
        app.services.taxProfile.init();
    }
};

//wait for the dom to load
$(function(){
    app.init();
});