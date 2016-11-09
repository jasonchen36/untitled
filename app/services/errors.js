var util = require('./util'),
    errors = {};

var NotFoundError = function(message) {
    this.name = 'NotFound';
    this.message = message || 'Not Found';
    this.statusCode = util.http.status.notFound;
};
NotFoundError.prototype = Object.create(Error.prototype);
NotFoundError.prototype.constructor = NotFoundError;
errors.NotFoundError = NotFoundError;

var InternalServerError = function(message) {
    this.name = 'InternalServerError';
    this.message = message || 'Internal Server Error';
    this.statusCode = util.http.status.internalServerError;
};
InternalServerError.prototype = Object.create(Error.prototype);
InternalServerError.prototype.constructor = InternalServerError;
errors.InternalServerError = InternalServerError;

var UnauthorizedError = function(message) {
    this.name = 'UnauthorizedError';
    this.message = message || 'Unauthorized Error';
    this.statusCode = util.http.status.unauthorized;
};
UnauthorizedError.prototype = Object.create(Error.prototype);
UnauthorizedError.prototype.constructor = UnauthorizedError;
errors.UnauthorizedError = UnauthorizedError;

var BadRequestError = function(message) {
    this.name = 'BadRequestError';
    this.message = message || 'Bad Request Error';
    this.statusCode = util.http.status.badRequest;
};
BadRequestError.prototype = Object.create(Error.prototype);
BadRequestError.prototype.constructor = BadRequestError;
errors.BadRequestError = BadRequestError;

module.exports = errors;