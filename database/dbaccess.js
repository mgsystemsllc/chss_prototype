
/**
* External module. 
*/
var sqlite3 = require('sqlite3').verbose();
var validator = require('validator');
var async = require('async');
var fs = require('fs'); 

/**
* Internal module. 
*/
var constants = require('../utility/constants.js');
var log = require('../diagnostic/debug.js');

/**
* Local variables.
*/
var dbExists = fs.existsSync('./database/data.db');
var db = new sqlite3.Database('./database/data.db');

/**
* Local functions.
*/
						
/**
* @fn createAllTable 
* @brief Create all tables of database.
* @param none
* @return none
*/
function createAllTable() {
	
	log.write(constants.logLevel.DEBUG, "In createAllTable...");
	
	db.serialize(function() {
	
		db.run("CREATE TABLE  users (UID INTEGER PRIMARY KEY AUTOINCREMENT,\
		user_name TEXT, password TEXT)");
		
		db.run("CREATE TABLE IF NOT EXISTS users_data (UID INTEGER NOT NULL UNIQUE, first_name TEXT,\
		last_name TEXT, gender TEXT, date_of_birth TEXT, marital_status TEXT, occupation TEXT, mobile_number TEXT,\
		spouse_first_name TEXT, spouse_last_name TEXT, spouse_gender TEXT, spouse_occupation TEXT,\
		spouse_mobile_number TEXT, spouse_date_of_birth TEXT, spouse_email_id TEXT,\
		FOREIGN KEY(UID) REFERENCES users(UID))");
		
		db.run("CREATE TABLE IF NOT EXISTS address (UID INTEGER NOT NULL UNIQUE,\
		street TEXT, locality TEXT, state TEXT, country TEXT, zipcode INTEGER,\
		FOREIGN KEY(UID) REFERENCES users(UID))");
		
		db.run("CREATE TABLE IF NOT EXISTS child_data (CID INTEGER PRIMARY KEY AUTOINCREMENT,\
		UID INTEGER NOT NULL, first_name TEXT, last_name TEXT, gender TEXT, date_of_birth TEXT,\
		FOREIGN KEY(UID) REFERENCES users(UID))");
		
		db.run("CREATE TABLE IF NOT EXISTS message_data (UID INTEGER NOT NULL UNIQUE,\
		email_id TEXT, password TEXT, FOREIGN KEY(UID) REFERENCES users(UID))");
	});
}

/**
* @fn isTableExist
* @brief Check in database if table exist or not
* @param tableName Name of Table
* @return data Return true, if successful
* @return err Return error message, if not successful
*/
function isTableExist(tableName, callback) {
	
	log.write(constants.logLevel.DEBUG, "In isTableExist..." + tableName);
	
	var query = "SELECT name FROM sqlite_master WHERE type = 'table' and name = '" + tableName + "'";
	
	db.get(query, function(err, row) {
		if(err) {
			return callback(null, "error: SQLite SELECT error." + err);
		} 
		else if(typeof row === "undefined") {
			return callback(null, "error: " + tableName + " table not exist in database.");
		} 
		return callback(null, true);
	});
}

/**
* @fn isAllTableExist
* @brief Check database for existence of all tables
* @param none
* @return data Return true, if successful
* @return err Return error message, if not successful
*/
function isAllTableExist(callback) {
	var fnArr = [];
	log.write(constants.logLevel.DEBUG, "In isAllTableExist...");
	
	fnArr.push(isTableExist.bind(null, "users")); 
	fnArr.push(isTableExist.bind(null, "users_data")); 
	fnArr.push(isTableExist.bind(null, "address")); 
	fnArr.push(isTableExist.bind(null, "child_data")); 
	fnArr.push(isTableExist.bind(null, "message_data")); 

	async.series(fnArr, function (err, results) {
		var errorMessage = "";
		
		if(err){
			log.write(constants.logLevel.ERROR, "unable to check table existence.");
			return callback("error", "unable to check table existence.");
		}
	
		for (var i = 0; i < results.length; i++) {
			log.write(constants.logLevel.DEBUG, "result" + i + " = " + results[i]);	
			if((results[i] + "").indexOf("error") >= 0){
				errorMessage += results[i];
			}
		}
	
		if(errorMessage.length > 0){
			log.write(constants.logLevel.ERROR, errorMessage);			
			return callback("error", errorMessage);
		}
		return callback(null, true);
	});
}

/**
* Exports section 
*/

/**
* @fn initialize
* @brief Create tables if not exists.
* @param none
* @return data true
* @return err false
*/
exports.initialize = function(callback) {
	
	log.write(constants.logLevel.DEBUG, "In initialize db...");
	
	if(!dbExists) createAllTable();

	isAllTableExist(function(err, data) {
		if(err){
			return callback("error", false);
		}
		else if(data === true){
			return callback(null, data);
		}
	});
}

/**
* @fn registerUser
* @brief Registers a user 
* @param objData Contain user registration data
* @return data Success/error json
* @return err null/Error json
*/
exports.registerUser = function(objData, callback) {
	
	log.write(constants.logLevel.DEBUG, "In registerUser...");

	if(!Object.keys(objData).length) {
		return callback("error", { 
			"status" : constants.httpResponseCode.BAD_REQUEST, 
			"data" : { "result" : "error", "message" : "Enter username and password!" }
		});
	}

	if(validator.isEmail(objData.username) === false) {
		return callback("error", { 
			"status" : constants.httpResponseCode.BAD_REQUEST, 
			"data" : { "result" : "error", "message" : "Incorrect user name!" }
		}); 
	}

	if(typeof objData.password === "undefined" || objData.password.length < 6) { 
		return callback("error", { 
			"status" : constants.httpResponseCode.BAD_REQUEST, 
			"data" : { "result" : "error", "message" : "Invalid password!" }
		}); 
	}

	var query = "SELECT * FROM users WHERE user_name = '" + objData.username + "'";
   
	db.get(query, function(err, row) { 
		if(err) {  
			log.write(constants.logLevel.ERROR, "SQLite SELECT error!" + err);
			return callback("error", { 
				"status" : constants.httpResponseCode.INTERNAL_SERVER_ERROR, 
				"data" : { "result" : "error", "message" : "Server Error"}
			}); 	
		} 
		else if(typeof row === "undefined") {  
			var sql = "INSERT INTO users (user_name, password) VALUES ('" + objData.username + "', '" + 	
			objData.password + "')";	 

			db.run(sql, function(err, data) { 
				if(err) {
					log.write(constants.logLevel.ERROR, "SQLite SELECT error!" + err);
					return callback("error", { 
						"status" : constants.httpResponseCode.INTERNAL_SERVER_ERROR, 
						"data" : { "result" : "error", "message" : "Server Error"}
					}); 
				} 
				else {
					return callback(null, { 
						"status" : constants.httpResponseCode.OK, 
						"data" : { "result" : "ok", "message" : "Registration successful." }
					}); 
		
				}
			});
		}
		else {
			return callback("error", { 
				"status" : constants.httpResponseCode.BAD_REQUEST, 
				"data" : { "result" : "error", "message" : "User already registered." }
			}); 

		}
	});
}

/**
* @fn updateUserProfile
* @brief Update user profile 
* @param objData Contain user profile details.
* @return data success/error json
* @return err null/error
*/
exports.updateUserProfile = function(objData, callback) {
	
	log.write(constants.logLevel.DEBUG, "In updateUserProfile...");

	if(!Object.keys(objData).length) {
		return callback("error", { 
			"status" : constants.httpResponseCode.BAD_REQUEST, 
			"data" : { "result" : "error", "message" : "No data!" }
		});
	}

	var query = "SELECT * FROM users_data WHERE UID = '" + objData.uid + "'";
   
	db.get(query, function(err, row) { 
		if(err) {  
			log.write(constants.logLevel.ERROR, "SQLite SELECT error!" + err);
			return callback("error", { 
				"status" : constants.httpResponseCode.INTERNAL_SERVER_ERROR, 
				"data" : { "result" : "error", "message" : "Server Error"}
			}); 
		} 
		else {

			var sql1 = "UPDATE users_data SET first_name = '" + objData.first_name + "', last_name = '" + 
			objData.last_name + "', gender = '" + objData.gender + "', date_of_birth = '" + objData.date_of_birth + "', marital_status = '" +
			objData.marital_status + "', occupation = '" + objData.occupation + "', mobile_number = '" + objData.mobile_number + "', spouse_first_name = '" +
			objData.spouse_first_name + "', spouse_last_name = '" + objData.spouse_last_name + "', spouse_gender = '" + objData.spouse_gender + 
			"', spouse_occupation = '" + objData.spouse_occupation + "', spouse_mobile_number = '" + objData.spouse_mobile_number + 
			 "', spouse_date_of_birth = '" + objData.spouse_date_of_birth + "', spouse_email_id = '" + objData.spouse_email + "' WHERE UID = '" + objData.uid + "'";
			
			var sql2 = "UPDATE address SET street = '" + objData.address_street + "', locality = '" + objData.address_locality + "', state = '" + objData.address_state + 
			"', country = '" + objData.address_country + "', zipcode = " + objData.address_zip + " WHERE UID = '" +objData.uid + "'";

			var sql3 = "UPDATE child_data SET first_name = '" + objData.child_first_name + "', last_name = '" + objData.child_last_name + "', gender = '" + objData.child_gender + 
			"', date_of_birth = '" + objData.child_date_of_birth + "' WHERE UID = '" + objData.uid + "'";

			db.run(sql1, function(err, data) {
				if(err) {
					log.write(constants.logLevel.ERROR, "SQLite UPDATE 1 error!" + err);
					return callback("error", { 
						"status" : constants.httpResponseCode.INTERNAL_SERVER_ERROR, 
						"data" : { "result" : "error", "message" : "Server error"}
					}); 
				} 
				else {
					db.run(sql2, function(err, data) {
						if(err) {
							log.write(constants.logLevel.ERROR, "SQLite UPDATE 2 error!" + err);
							return callback("error", { 
								"status" : constants.httpResponseCode.INTERNAL_SERVER_ERROR, 
								"data" : { "result" : "error", "message" : "Server error"}
							}); 
						} 
						else {
							db.run(sql3, function(err, data) {
								if(err) {
									log.write(constants.logLevel.ERROR, "SQLite UPDATE 3 error!" + err);
									return callback("error", { 
										"status" : constants.httpResponseCode.INTERNAL_SERVER_ERROR, 
										"data" : { "result" : "error", "message" : "Server error"}
									}); 
								} 
								else {
									return callback(null, { 
										"status" : constants.httpResponseCode.OK, 
										"data" : { "result" : "ok", "message" : "view-profile.html" }
									}); 
								} 
							}); 
						}
					});
				}
			});
		}
	});
}

/**
* @fn createUserProfile
* @brief Create user profile 
* @param objData Contain user profile details
* @return data success/error json
* @return err null/error json
*/
exports.createUserProfile = function(objData, callback) {
	
	log.write(constants.logLevel.DEBUG, "In createUSerProfile...");

	if(!Object.keys(objData).length) {
		return callback("error", { 
			"status" : constants.httpResponseCode.BAD_REQUEST, 
			"data" : { "result" : "error", "message" : "No data!" }
		});
	}

	var query = "SELECT * FROM users_data WHERE UID = '" + objData.uid + "'";
   
	db.get(query, function(err, row) { 
		if(err) {  
			log.write(constants.logLevel.ERROR, "SQLite SELECT error!" + err);
			return callback("error", { 
				"status" : constants.httpResponseCode.INTERNAL_SERVER_ERROR, 
				"data" : { "result" : "error", "message" : "Server error"}
			}); 	
		} 
		else if(typeof row !== "undefined") {  
			
			return callback("error", { 
				"status" : constants.httpResponseCode.BAD_REQUEST, 
				"data" : { "result" : "error", "message" : "Profile already exists!" }
			});
		}
		else {

			var sql1 = "INSERT INTO users_data VALUES (" + objData.uid + ", '" + objData.first_name + "', '" + 
			objData.last_name + "', '" + objData.gender + "', '" + objData.date_of_birth + "', '" +
			objData.marital_status + "', '" + objData.occupation + "', '" + objData.mobile_number + "', '" +
			objData.spouse_first_name + "', '" + objData.spouse_last_name + "', '" + objData.spouse_gender + 
			"', '" + objData.spouse_occupation + "', '" + objData.spouse_mobile_number + 
			 "', '" + objData.spouse_date_of_birth + "', '" + objData.spouse_email + "')";
			
			var sql2 = "INSERT INTO address VALUES (" + objData.uid + ", '" + 
			objData.address_street + "', '" + objData.address_locality + "', '"+objData.address_state+"', '" +	
			objData.address_country + "', '" + objData.address_zip + "')";

			var sql3 = "INSERT INTO child_data(UID, first_name, last_name, gender, date_of_birth) VALUES (" + objData.uid + ", '" + 
			objData.child_first_name + "', '" + objData.child_last_name + "', '" + objData.child_gender + "', '" +
			objData.child_date_of_birth + "')";

			db.run(sql1, function(err, data) {
				if(err) {
					log.write(constants.logLevel.ERROR, "SQLite INSERT 1 error!" + err);
					return callback("error", { 
						"status" : constants.httpResponseCode.INTERNAL_SERVER_ERROR, 
						"data" : { "result" : "error", "message" : "Server error"}
					}); 
				} 
				else {
					db.run(sql2, function(err, data) {
						if(err) {
							log.write(constants.logLevel.ERROR, "SQLite INSERT 2 error!" + err);
							return callback("error", { 
								"status" : constants.httpResponseCode.INTERNAL_SERVER_ERROR, 
								"data" : { "result" : "error", "message" : "Server error"}
							}); 
						} 
						else {
							db.run(sql3, function(err, data) {
								if(err) {	 
									log.write(constants.logLevel.ERROR, "SQLite INSERT 3 error!" + err);
									return callback("error", { 
										"status" : constants.httpResponseCode.INTERNAL_SERVER_ERROR, 
										"data" : { "result" : "error", "message" : "Server error"}
									}); 
								} 
								else {
									return callback(null, { 
										"status" : constants.httpResponseCode.OK, 
										"data" : { "result" : "ok", "message" : "view-profile.html" }
									}); 
								} 
							}); 
						}
					});
				}
			});
		}
	});
}

/**
* @fn getUserProfileData
* @brief Get user profile data
* @param uid User ID of the user 
* @return data success/error json
* @return err null/error json
*/
exports.getUserProfileData = function(uid, callback) {
	
	log.write(constants.logLevel.DEBUG, "In getUserProfileData...");
	
	var sql1 = "SELECT * FROM users_data WHERE UID = '" + uid + "'";
	var sql2 = "SELECT * FROM address WHERE UID = '" + uid + "'";
	var sql3 = "SELECT * FROM child_data WHERE UID = '" + uid + "'";
	
	db.get(sql1, function(err, row1) { 
		if(err) {
			log.write(constants.logLevel.ERROR, "SQLite SELECT error!" + err);
			return callback("error", { 
				"status" : constants.httpResponseCode.INTERNAL_SERVER_ERROR, 
				"data" : { "result" : "error", "message" : "Server error"}
			});
		}
		else if(typeof row1 === "undefined") {  
			
			return callback(null, { 
				"status" : constants.httpResponseCode.OK, 
				"data" : { "result" : "ok", "file" : "create-profile.html"}
			});
		}
		else {
			db.get(sql2, function(err, row2) { 
				if(err) {  
					log.write(constants.logLevel.ERROR, "SQLite SELECT error!" + err);
					return callback("error", { 
						"status" : constants.httpResponseCode.INTERNAL_SERVER_ERROR, 
						"data" : { "result" : "error", "message" : "Server error"}
					}); 	
				} 
				else {
					db.get(sql3, function(err, row3) { 
						if(err) {  
							log.write(constants.logLevel.ERROR, "SQLite SELECT error!" + err);
							return callback("error", { 
								"status" : constants.httpResponseCode.INTERNAL_SERVER_ERROR, 
								"data" : { "result" : "error", "message" : "Server error"}
							}); 	
						} 
						else {
							return callback(null, { 
								"status" : constants.httpResponseCode.OK, 
								"data" : { "result" : "ok",
										"first_name" : row1.first_name,
										"last_name" : row1.last_name,								
										"gender" : row1.gender,
										"date_of_birth" : row1.date_of_birth,
										"marital_status" : row1.marital_status,
										"occupation" : row1.occupation,
										"mobile_number" : row1.mobile_number,
										"spouse_first_name" : row1.spouse_first_name,
										"spouse_last_name" : row1.spouse_last_name,
										"spouse_gender" : row1.spouse_gender,
										"spouse_date_of_birth" : row1.spouse_date_of_birth,
										"spouse_occupation" : row1.spouse_occupation,
										"spouse_mobile_number" : row1.spouse_mobile_number,
										"spouse_email" : row1.spouse_email_id,
										"address_street" : row2.street,
										"address_locality" : row2.locality,
										"address_state" : row2.state,
										"address_country" : row2.country,
										"address_zip" : row2.zipcode,
										"count" : 1,
										"children" : [{ "child_first_name" : row3.first_name,
												"child_last_name" : row3.last_name,
												"child_gender" : row3.gender,
												"child_date_of_birth" : row3.date_of_birth
										}],
									"file" : "view-profile.html"}
							}); 
						}
					});
				}
			});
		}
	});
}


/**
* @fn getUID
* @brief Fetches the UID corresponding to username and password
* @param username user name of the user
* @param password password of the user
* @return data null / uid of user
* @return err null
*/
exports.getUID = function(username, password, callback) {
	
	log.write(constants.logLevel.DEBUG, "In getUID...");

	var sql = "SELECT * FROM users WHERE user_name = '" + username + 
	"' AND password = '" + password + "'";

	db.get(sql, function(err, row) { 
		if(err || typeof row === "undefined") {  
			return callback(null, null);	
		} 
		else {
			return callback(null, row);	
		}
	});
}
