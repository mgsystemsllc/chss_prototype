
/**
* Globals. 
*/
var username = localStorage.getItem("username");
var password = localStorage.getItem("password");

console.log("username" + username);
console.log("password" + password);

$("#errorSuccessLoadingPopup").append(
	'<div id="error" class="modal fade" role="dialog">' +
	'<div class="modal-dialog" style="max-width:400px;">' +
	'<div class="modal-content" style="padding:10px;">' +
	'<div class="modal-body">' +
		'<button type="button" class="close" data-dismiss="modal">&times;</button>' +
		'<h4 class="modal-title" style="color:red;">Error</h4>' +
		'<p id="errorMessage">Some text in the modal.</p><br>' +
        	'<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
	'</div>' +
	'</div>' +
	'</div>' +
	'</div>' +
	'<div id="success" class="modal fade" role="dialog">' +
	'<div class="modal-dialog" style="max-width:400px;">' +
	'<div class="modal-content" style="padding:10px;">' +
	'<div class="modal-body">' +
		'<button type="button" class="close" data-dismiss="modal">&times;</button>' +
		'<h4 class="modal-title" style="color:green;">Success</h4>' +
		'<p id="successMessage">Some text in the modal.</p><br>' +
        	'<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
	'</div>' +
	'</div>' +
	'</div>' +
	'</div>'
);

/**
* @fn showSuccessPopup
* @brief display custom success pop up
* @param message Message string to display
* @return none
*/
function showSuccessPopup(message) {
	$("#successMessage").html(message);
	$("#success").modal();
}

/**
* @fn showErrorPopup
* @brief Display custom error pop up
* @param message Message string to display
* @return none
*/
function showErrorPopup(message) {
	$("#errorMessage").html(message);
	$("#error").modal();
}

$("#profile").click(function() {

	var url = '/v1/users/profiles'; 
	
	sendGetRequestToServer(url, null, function(err, objData) {
		if(err) {
			alert(JSON.stringify(objData));
		}
		else {
			localStorage.setItem("profileData", JSON.stringify(objData));
			window.location = objData.json.file;
		}
	});
});

/**
* @fn logout
* @brief Logs user out by clearing local storage
* @param none
* @return none
*/
function logout() {
	localStorage.removeItem("username");
	localStorage.removeItem("password");
	localStorage.removeItem("profileData");
}

/**
* @fn sendGetRequestToServer
* @brief Get Rest API call to server
* @param url URL of get request
* @param objJson json to be sent as part of body
* @return none
*/
function sendGetRequestToServer(url, objJson, callback) {
	
	$.ajax({
		url : url,
		type : "GET",
		dataType : "text",
		processData : true,
		contentType:"application/json; charset=utf-8",
		beforeSend: function (xhr) {
			xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
		},
		error: function (xhr, status, error) {
			var errmsg = $.parseJSON(xhr.responseText);
			callback("error", errmsg);	
		},
		success: function (data, status, request) {
			var objData = $.parseJSON(data);
			callback(null, objData);
		}
	});
}

/**
* @fn sendPostRequestToServer
* @brief Post Rest API call to server
* @param url URL of POST request
* @param objJson json to be sent as part of body
* @return none
*/
function sendPostRequestToServer(url, objJson, callback) {
	
	$.ajax({
		url : url,
		type : "POST",
		dataType : "text",
		processData : true,
		data: JSON.stringify(objJson),
		contentType:"application/json; charset=utf-8",
		beforeSend: function (xhr) {
			xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
		},
		error: function (xhr, status, error) {
			var errmsg = $.parseJSON(xhr.responseText);
			callback("error", errmsg);
		},
		success: function (data, status, request) {
			var objData = $.parseJSON(data);
			callback(null, objData);
		}
	});
}

/**
* @fn sendPutRequestToServer
* @brief Put Rest API call to server
* @param url URL of PUT request
* @param objJson json to be sent as part of body
* @return none
*/
function sendPutRequestToServer(url, objJson, callback) {
	
	$.ajax({
		url : url,
		type : "PUT",
		dataType : "text",
		processData : true,
		data: JSON.stringify(objJson),
		contentType:"application/json; charset=utf-8",
		beforeSend: function (xhr) {
			xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
		},
		error: function (xhr, status, error) {
			var errmsg = $.parseJSON(xhr.responseText);
			callback("error", errmsg);
		},
		success: function (data, status, request) {
			var objData = $.parseJSON(data);
			callback(null, objData);
		}
	});
}
