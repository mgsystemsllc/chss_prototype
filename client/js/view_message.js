/**
* Global variable. 
*/

var objMessageList = $.parseJSON(localStorage.getItem("objMessageList"));
var objMessageBody = $.parseJSON(localStorage.getItem("objMessageBody")); 
console.log(objMessageList);
console.log(objMessageBody);

/**
* @fn showMessageBody
* @brief Show body of message
* @param none
* @return none
*/
function showMessageBody() {

	for(item in objMessageList) {	
		if(objMessageList[item].message_id === objMessageBody.message_id) {
			$("#from").html(objMessageList[item].message_header.from);
			$("#date").html(objMessageList[item].message_header.date);
			$("#subject").html(objMessageList[item].message_header.subject);
			$("#message").html(objMessageBody.message_body);
		}
	}	
}

/**
* @fn replyMessage
* @brief Create a message reply
* @param none
* @return none
*/
function replyMessage() {
	$("#reply_box").show();
	
	$("#reply_message").val(
		"Date: " + $("#date").html() + "\n" + 
		"From: " + $("#from").html() + "\n" + 
		"Subject: " + $("#subject").html() + "\n" + 
		"Message: " + $("#message").html() + "\n" 
	);
}

/**
* @fn sendMessage
* @brief Post message to server
* @param none
* @return none
*/
function sendMessage() {
	
	var message = $("#reply_message").val();

	if(message === '') {
		showErrorPopup("Enter your message!");
		return;
	}

	var objJson = {
		"subject" : "Reply : " + $("#subject").html(),
		"message" : message
	};
	
	var url = "/v1/messages/send";

	sendPostRequestToServer(url, objJson, function(err, objData) {
		if(err) {
			showErrorPopup(objData.json.message);
		}
		else {
			$("#reply_message").val('');
			showSuccessPopup(objData.json.message);
			$("#reply_box").hide();
		}
	});
}

showMessageBody();

