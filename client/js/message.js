
/**
* @fn sendMessage
* @brief Post new message to server
* @param none
* @return none
*/
function sendMessage() {
	
	var subject = $("#subject").val();
	var message = $("#message").val();

	if(subject === '') {
		showErrorPopup("Enter subject name!");
		return;
	}
	
	if(message === '') {
		showErrorPopup("Enter your message!");
		return;
	}

	var objJson = {
		"subject" : subject,
		"message" : message
	};
	
	var url = "/v1/messages/send";

	sendPostRequestToServer(url, objJson, function(err, objData) {
		if(err) {
			showErrorPopup(objData.json.message);
		}
		else {
			$("#subject").val('');
			$("#message").val('');
			showSuccessPopup(objData.json.message);
		}
	});
}
