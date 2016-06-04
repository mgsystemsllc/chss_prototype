
/**
* Globals. 
*/
var counter = 1;
var next = true;
	
/**
* @fn getMessageList
* @brief Send server request to fetch message list
* @param none
* @return none
*/
function getMessageList() {
	
	var url = 'v1/messages/list?start='+next+'&end='+counter; 
	
	sendGetRequestToServer(url, null, function(err, objData) {
		if(err) {
			showErrorPopup(objData);
		}
		else {
			showMessageList(objData.json);
			localStorage.setItem("objMessageList", JSON.stringify(objData.json.messages));
		}
	});
}

/**
* @fn getMessageBody
* @brief Send server request to fetch message body
* @param messageId Id of message on server
* @return none
*/
function getMessageBody(messageId) {
	
	var url = 'v1/messages/' + messageId; 
	
	sendGetRequestToServer(url, null, function(err, objMessageBody) {
		if(err) {
			showErrorPopup(objMessageBody);
		}
		else {
			localStorage.setItem("objMessageBody", JSON.stringify(objMessageBody.json));
			window.location = "view-message.html";
		}
	});
}

/**
* @fn showMessageList
* @brief Show message list on page
* @param objData message list object 
* @return none
*/
function showMessageList(objData) {
	
	if(objData.count === 0) {
		$("#nomail").show();
		return;
	}
	$("#nomail").hide();
	
	var objMessageData = objData.messages, last;
	if(objMessageData.length === 0) return;
	total = objData.count;
	$("#messageList").empty();	
	
	for(item in objMessageData) {

		var index = objMessageData.length - item - 1;
		var objData = objMessageData[index];
		var date = new Date(objData.message_header.date);
		var currentDate = new Date();
		
		if(currentDate.getDate() === date.getDate()) {
			
			var hours, minutes;
			var millisecond = Date.now() - date.getTime();
			
			hours = parseInt((millisecond/(1000*60*60))%24);
			minutes = parseInt((millisecond/(1000*60))%60);
			hours = (hours < 10) ? "0" + hours : hours;
        	minutes = (minutes < 10) ? "0" + minutes : minutes;
			date = hours + ":" + minutes;
		}
		else { 
			var month;

			switch(date.getMonth()) {
				case 0: month = "Jan"; break;
				case 1: month = "Feb"; break;
				case 2: month = "Mar"; break;
				case 3: month = "Apr"; break;
				case 4: month = "May"; break;
				case 5: month = "Jun"; break;
				case 6: month = "Jul"; break;
				case 7: month = "Aug"; break;
				case 8: month = "Sep"; break;
				case 9: month = "Act"; break;
				case 10: month = "Nov"; break;
				case 11: month = "Dec"; break;
			}
			date = month + " " + date.getDate();
		}

		$("#messageList").append(
		'<tr class="unread checked" style="cursor:pointer;">' +
			'<td class="hidden-xs">' +
				'<input type="checkbox" class="checkbox">' +
		    	'</td><td class="hidden-xs" onclick="getMessageBody('+ objData.message_id +');">' +
				objData.message_header.from +
		    	'</td><td onclick="getMessageBody('+ objData.message_id +');">' +
				 objData.message_header.subject +
		    	'</td><td onclick="getMessageBody('+ objData.message_id +');">' +
				date +
		    	'</td>' +
		'</tr>');
	}
}

/**
* @fn showMessageBody
* @brief Show message body on page
* @param objMessageData Message body object
* @return none
*/
function showMessageBody(objMessageData) {
	$("#messageList").hide();
	$("#messageBody").show();
	$("#message").html(objMessageData.message_body);
}

/**
* @fn getNextNessages
* @brief Fetch next message list
* @param none
* @return none
*/
function getNextNessages() {
	counter = 2;
	next = true;
	getMessageList();
}

/**
* @fn getPreviousNessages
* @brief Fetch previous message list
* @param none
* @return none
*/
function getPreviousNessages() {
	if(counter > 1) {
		next = false;
		getMessageList();
	}
}

getMessageList();
