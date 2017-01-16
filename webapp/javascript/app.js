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
    apiservice: {},
    dependants_helpers: {},
    state: {},
    mediaQueries: {},
    services: {
        taxProfile: {},
        personalProfile: {},
        dashboard: {}
    },

    //modules
    carousel: {},

    //templates
    views: {
        dashboard: {
            upload: {},
            chat: {},
            myReturn: {}
        },
        personalProfile: {
            lastName: {},
            specialScenarios: {},
            maritalStatus: {},
            dependants: {},
            address: {},
            birthdate: {},
            income: {},
            credits: {},
            deductions: {}
        },
        taxProfile: {
            welcome: {},
            filingFor: {},
            filersNames: {},
            quote: {},
            quoteApplies: {},
            modalQuote: {}
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

        //regular views
        views.user.login.init();
        views.user.register.init();
        views.user.passwordReset.init();
        views.user.authorizedPasswordReset.init();

        //one page views
        app.services.taxProfile.init();
        app.services.personalProfile.init();
        app.services.dashboard.init();
    }
};

//wait for the dom to load
$(function(){
    app.init();
});
