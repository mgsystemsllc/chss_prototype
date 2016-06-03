/**
* External modules
*/
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var passport = require('passport');
var basicStrategy = require('passport-http').BasicStrategy;

/**
* Internal modules
*/
var userRouter = require('./routes/users.js');
var messageRouter = require('./routes/messages.js');
var facilitiesRouter = require('./routes/facilities.js');
var agenciesRouter = require('./routes/agencies.js');
var dbManager = require('./database/dbaccess.js');
var authManager = require('./authentication/authentication.js');
var constants = require('./utility/constants.js');
var log = require('./diagnostic/debug.js');

/**
* Local variables
*/ 
var app = express();

/**
* Middleware configuration
*/
//app.use(basicAuth('username', 'password'));
app.use(express.static(path.join(__dirname, 'client')));
app.use(bodyParser.json());    
app.use(bodyParser.urlencoded({
	extended: true
})); 
app.use('/v1/users/', userRouter);
app.use('/v1/messages/', messageRouter);
app.use('/v1/facilities/', facilitiesRouter);
app.use('/v1/agencies/', agenciesRouter);

/**
* Initialize database and start server
*/
console.log('\n Logging Mode - ' + constants.LOGGING_MODE);

dbManager.initialize(function(err, data) {
	if(data === false) {
		log.write(constants.logLevel.ERROR, 'Database - ' + data);
	}
	else {
		log.write(constants.logLevel.DEBUG, 'Database - ' + data);
		
		passport.use(new basicStrategy({ passReqToCallback: true }, function (req, username, password, done) {
			
			process.nextTick(function () {
				authManager.authenticateUser(req, username, password, function (err, uid) {
					
					if (err) {
						log.write(constants.logLevel.DEBUG, "Error occurred in validation." + err);
						return done(err); 
					}
					if (!uid) { 
						log.write(constants.logLevel.DEBUG, "User name not found.");
						return done(null, false); 
					}
					return done(null, uid);
				});
			});
		}));

		app.use(passport.initialize());
		
		startServer();
	}
});

function startServer() {
	log.write(constants.logLevel.DEBUG, 'In startServer');

	app.listen(constants.PORT_NUMBER, function () {
		log.write(constants.logLevel.NONE, '*************************************************');
		log.write(constants.logLevel.INFO, 'App listening on port - ' + constants.PORT_NUMBER);
		log.write(constants.logLevel.NONE, '*************************************************');
	});
}


