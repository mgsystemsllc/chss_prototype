/**
* External modules. 
*/
var express = require('express');
var router = express.Router();
var passport = require('passport');

/**
* Internal modules. 
*/
var dbManager = require('../database/dbaccess.js');
var constants = require('../utility/constants.js');
var log = require('../diagnostic/debug.js');

/**
* GET REST API
*/
router.get('/profiles', passport.authenticate('basic', {session: false}), function(req, res) {
	log.write(constants.logLevel.DEBUG, JSON.stringify(req.body));
	
	dbManager.getUserProfileData(req.body.uid, function(err, objData) {
		log.write(constants.logLevel.DEBUG, JSON.stringify(objData.data));
		res.status(objData.status); 
		res.send(JSON.stringify({json : objData.data}));
	});
});

/**
* PUT REST API
*/
router.put('/profiles', passport.authenticate('basic', {session: false}), function(req, res) {
	log.write(constants.logLevel.DEBUG, JSON.stringify(req.body));
	
	dbManager.updateUserProfile(req.body, function(err, objData) {
		log.write(constants.logLevel.DEBUG, objData.data);
		res.status(objData.status); 
		res.send(JSON.stringify({json : objData.data}));
	});
});

router.put('/', passport.authenticate('basic', {session: false}), function(req, res) {
	log.write(constants.logLevel.DEBUG, JSON.stringify(req.body));
	
	res.status(constants.httpResponseCode.OK);
	res.send(JSON.stringify({"json" : { "result" : "ok", "message" : "home.html" }}));
});

/**
* POST REST API
*/
router.post('/', function(req, res) {
	log.write(constants.logLevel.DEBUG, JSON.stringify(req.body));
	
	dbManager.registerUser(req.body, function(err, objData) {
		log.write(constants.logLevel.DEBUG, objData.data);
		res.status(objData.status); 
		res.send(JSON.stringify({json : objData.data}));
	});
});

router.post('/profiles', passport.authenticate('basic', {session: false}), function(req, res) {
	log.write(constants.logLevel.DEBUG, JSON.stringify(req.body));
	
	dbManager.createUserProfile(req.body, function(err, objData) {
		log.write(constants.logLevel.DEBUG, JSON.stringify(objData.data));
		res.status(objData.status); 
		res.send(JSON.stringify({json : objData.data}));
	});
});

module.exports = router;

