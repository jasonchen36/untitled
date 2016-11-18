/*

 this follows the namespacing pattern listed here https://addyosmani.com/blog/essential-js-namespacing/

 */

var app = {

    //lib
    ajax: {},
    animations: {},
    cookies: {},
    handlebars: {},
    helpers: {},
    state: {},
    mediaQueries: {},

    //modules
    carousel: {},

    //templates
    views: {
        profile: {
            pageOne: {},
            pageTwo: {},
            pageThree: {},
            pageFour: {},
            pageFive: {},
            pageSix: {},
            pageSeven: {},
            pageQuote: {}
        },
        user: {
            login: {},
            register: {},
            passwordReset: {}
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
        
        //user views
        views.user.login.init();
        views.user.register.init();
        views.user.passwordReset.init();

        //tax profile views
        views.profile.pageOne.init();
        views.profile.pageTwo.init();
        views.profile.pageThree.init();
        views.profile.pageFour.init();
        views.profile.pageFive.init();
        views.profile.pageSix.init();
        views.profile.pageSeven.init();
        views.profile.pageQuote.init();
    }
};

//wait for the dom to load
$(function(){
    app.init();
});