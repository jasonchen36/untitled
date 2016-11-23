const express = require('express'),
    handlebars = require('express-handlebars'),
    cookieParser = require('cookie-parser'),
    cors = require('cors'),
    favicon = require('serve-favicon'),
    helmet = require('helmet'),
    bodyParser = require('body-parser'),
    path = require('path'),
    compression = require('compression'),
    cookieSession = require('cookie-session'),
    expressValidator = require('express-validator'),
//services
    logger = require('./app/services/logger'),
    handlebarsHelpers = require('./app/services/handlebars'),
    errorService = require('./app/services/errors'),
    util = require('./app/services/util'),
// routes
    errorRoutes = require('./app/routes/errors'),
    userRoutes = require('./app/routes/user'),
    taxProfileRoutes = require('./app/routes/tax_profile'),
    personalProfileRoutes = require('./app/routes/personal_profile'),
    dashboardRoutes = require('./app/routes/dashboard'),
//controllers
    errorController = require('./app/controllers/errors'),
//middleware
    authenticationMiddleware = require('./app/middleware/authentication'),
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
app.use(favicon(__dirname + '/webapp/public/images/favicon.ico'));

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
app.use(expressValidator());


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
app.set('views', path.join(__dirname, 'webapp/views'));


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
app.use('/public', express.static(path.join(__dirname, 'webapp/public'),{
    index: false,
    maxAge: util.environment.isProduction()?'7 days':0
}));

//for debugging included libs
app.use('/bower_components', express.static(path.join(__dirname, 'webapp/bower_components')));


/**
 * routes
 */
app.use('/', errorRoutes);
app.use('/', userRoutes);
app.use('/tax-profile', authenticationMiddleware.redirectWithUserSession, taxProfileRoutes);
app.use('/dashboard', authenticationMiddleware.redirectWithoutUserSession, dashboardRoutes);
app.use('/personal-profile', authenticationMiddleware.redirectWithoutUserSession, personalProfileRoutes);


/**
 * error handlers
 */
app.use(function (req, res, next) {
    //404 handler
    logger.info('not found - '+req.method+' '+req.originalUrl);
    next(new errorService.NotFoundError());
});

app.use(function (err, req, res, next) {
    //general error handler
    logger.error(err);
    if ((req.body.action && req.body.action.indexOf('api') !== -1) || (err.message && typeof err.message === 'string' && err.message.indexOf('api') !== -1)){
        //api routes handler
        if (err && err.statusCode) {
            switch (err.statusCode) {
                case util.http.status.notFound:
                    res.status(util.http.status.notFound).json({
                        action: req.body.action,
                        status: util.http.status.notFound,
                        message: err.message
                    });
                    break;
                case util.http.status.unauthorized:
                    res.status(util.http.status.unauthorized).json({
                        action: req.body.action,
                        status: util.http.status.unauthorized,
                        message: err.message
                    });
                    break;
                case util.http.status.badRequest:
                    res.status(util.http.status.badRequest).json({
                        action: req.body.action,
                        status: util.http.status.badRequest,
                        message: err.message
                    });
                    break;
                case util.http.status.internalServerError:
                default:
                    res.status(util.http.status.internalServerError).json({
                        action: req.body.action,
                        status: util.http.status.internalServerError,
                        message: err.message
                    });
                    break;
            }
        } else {
            res.status(util.http.status.internalServerError).json({
                action: req.body.action,
                status: util.http.status.internalServerError,
                message: err.message
            });
        }
    } else {
        //page request errors
        if (err && err.statusCode) {
            switch (err.statusCode) {
                case util.http.status.notFound:
                    errorController.get404Page(req, res, next);
                    break;
                case util.http.status.unauthorized:
                    res.redirect('/login');
                    break;
                case util.http.status.badRequest:
                    errorController.get500Page(req, res, next);
                    break;
                case util.http.status.internalServerError:
                    errorController.get500Page(req, res, next);
                    break;
            }
        } else {
            errorController.get500Page(req, res, next);
        }
    }
});


/**
 *  start server
 */
logger.info("Starting server");
app.listen(port, function() {
    logger.info('%s: Node server started on port %d', Date(Date.now()), port);
});

module.exports = app;