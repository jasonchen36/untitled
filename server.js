const express = require('express'),
    requestPromise = require('request-promise'),
    handlebars = require('express-handlebars'),
    cookieParser = require('cookie-parser'),
    cors = require('cors'),
    favicon = require('serve-favicon'),
    helmet = require('helmet'),
    bodyParser = require('body-parser'),
    path = require('path'),
    compression = require('compression'),
    cookieSession = require('cookie-session'),
//services
    bookshelf = require('./app/services/bookshelf'),
    logger = require('./app/services/logger'),
    handlebarsHelpers = require('./app/services/handlebars'),
//variables
    port = process.env.NODE_PORT || 3000,
//main declaration
    app = express();

/**
 * Settings
 */

app.use(cors());
app.options('*', cors());
app.use(cookieParser());

//Remove trailing slashes
app.use(function(req, res, next) {
    //http://stackoverflow.com/questions/13442377/redirect-all-trailing-slashes-gloablly-in-express
    if(req.url.slice(0, -1) == '/' && req.url.length > 1) {
        res.redirect(301, req.url.slice(0, -1));
    } else {
        next();
    }
});

//security extensions
app.use(helmet());

//parse form data
app.use(bodyParser.json());// to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
// to support URL-encoded bodies
    extended: true
}));


/**
 *  view engine
 */
app.engine('.hbs', handlebars({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: handlebarsHelpers,
    layoutsDir: 'webapp/views/layouts',
    partialsDir: 'webapp/views/partials'
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));


/**
 *  cookie session
 */
app.set('trust proxy', 1); // trust first proxy

app.use(cookieSession({
    name: 'session',
    keys: [
        process.env.NODE_COOKIE_KEY1,
        process.env.NODE_COOKIE_KEY2
    ]
}));

app.use(function (req, res, next) {
    // Update views
    req.session.views = (req.session.views || 0) + 1;

    // Write response
    res.end(req.session.views + ' views')
});


/**
 *  gzip compression
 */
app.use(compression({
    // only compress files for the following content types
    filter: function(req, res) {
        return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    // zlib option for compression level
    level: 3
}));


/**
 *  static files directory
 */
app.use(express.static(path.join(__dirname, 'webapp/public'),{
    index: false,
    maxAge: process.env.NODE_ENV.toLowerCase() === 'production'?'7 days':0
}));

//for debugging included libs
app.use('/bower_components', express.static(path.join(__dirname, 'webapp/bower_components')));


/**
 *  start server
 */
logger.info("Starting server");
app.listen(port, function() {
    logger.info('%s: Node server started on port %d', Date(Date.now()), port);
});

module.exports = app;