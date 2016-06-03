/**
* Internal modules
*/
var constants = require('../utility/constants.js');

/**
* Exports section 
*/

/**
* @fn write
* @brief Writes log details to console
* @param logLevel Specifies message log level
* @param message Message string to log
* @return none
*/
exports.write = function(logLevel, message) {
	
	if(!constants.LOGGING_MODE) return;
	
	switch(logLevel) {
	
		case constants.logLevel.INFO :
		console.info(" INFO   : " + message);
		break; 
	
		case constants.logLevel.WARNING :
		console.warn(" WARNING   : " + message); 
		break;

		case constants.logLevel.ERROR : 
		console.error(" ERROR   : " + message); 
		break;

		case constants.logLevel.DEBUG : 
		console.log(" DEBUG   : " + message); 
		break;

		default : 
		console.log(message); 
		break;
	}
}


