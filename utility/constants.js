
/** Server Configuration Constants */
exports.PORT_NUMBER = 3000;
exports.MAIL_SERVER_IP_ADDRESS = '192.168.1.12';

/** Debug Constants */
exports.LOGGING_MODE = true;
exports.logLevelName = ["", "error", "warning", "info", "debug"];
exports.logLevel = {
	"ERROR" : 1,
	"WARNING" : 2,
	"INFO" : 3,
	"DEBUG" : 4,
	"NONE" : 5
};

/** Http Response Code */
exports.httpResponseCode = {
	"OK" : 200,
	"CREATED" : 201,
	"ACCEPTED" : 202,
	"NO_CONTENT" : 204,
	"MOVED_PERMANENTLY" : 301,
	"NOT_MODIFIED" : 304,
	"TEMPORARY_REDIRECT" : 307,
	"BAD_REQUEST" : 400,
	"UNAUTHORIZED" : 401,
	"FORBIDDEN" : 403,
	"NOT_FOUND" : 404,
	"METHOD_NOT_ALLOWED" : 405,
	"REQUEST TIMEOUT" : 408,
	"CONFLICT" : 409,
	"PRECONDITION_FAILED" : 412,
	"UNSUPPORTED_MEDIA_TYPE" : 415,
	"UNPROCESSABLE_ENTITY" : 422,
	"INTERNAL_SERVER_ERROR" : 500
};
