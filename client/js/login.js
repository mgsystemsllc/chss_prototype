
/**
* @fn loginUser
* @brief Login user to server after verification
* @param none
* @return none
*/
function loginUser() {

	if($("#username").val() === '') return;
	if($("#password").val() === '') return;

	var username = $("#username").val();
	var password = $("#password").val();

	var objData = {
		username : username,
		password : password
	}
	
	var url = '/v1/users'; 

	$.ajax({
		url : url,
		type : "PUT",
		dataType : "text",
		processData : true,
		data : JSON.stringify(objData),
		contentType:"application/json; charset=utf-8",
		beforeSend: function (xhr) {
			xhr.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
		},
		error: function (xhr, status, error) {
			var objData = $.parseJSON(xhr.responseText);	
			showErrorPopup(objData.json.message);
			$("#password").val('');
		},
		success: function (data, status, request) {
			var objData = $.parseJSON(data);
			localStorage.setItem("username", username);
			localStorage.setItem("password", password);	
			window.location = objData.json.message;
		}
	});
}
