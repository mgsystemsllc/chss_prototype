
/**
* Internal module. 
*/
var constants = require('../utility/constants.js');
var log = require('../diagnostic/debug.js');
var dbManager = require('../database/dbaccess.js');

/**
* Exports section 
*/

/**
* @fn authenticateUser
* @brief Verify presence of user in database
* @param request Request for authenticate user from client
* @param username username of user
* @param password password of user
* @return data null/user object
* @return err null/"error" 
*/
exports.authenticateUser = function(request, username, password, callback) {
	
	log.write(constants.logLevel.DEBUG, "In authenticateUser...");
	log.write(constants.logLevel.DEBUG, "method = " + request.method);
	log.write(constants.logLevel.DEBUG, "url = " + request.originalUrl);
	log.write(constants.logLevel.DEBUG, "username - " + username);
	log.write(constants.logLevel.DEBUG, "password - " + password);
	
	dbManager.getUID(username, password, function(err, data) {
		if(data) request.body.uid = data.UID;
		return callback(err, data);
	}); 
};

