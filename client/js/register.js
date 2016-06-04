
/**
* @fn registerUser
* @brief Create user registration on server
* @param none
* @return none
*/
function registerUser() {

	if($("#email").val() === '') return;
	if($("#password").val() === '') return;

	var emailId = $("#email").val();
	var password = $("#password").val();

	var objData = {
		username : emailId,
		password : password
	}
	
	var url = '/v1/users'; 
	
	$.post(url, objData)
    	.done( function(data) {
		var objData = $.parseJSON(data);
		showSuccessPopup(objData.json.message);
		reset();
	})
    	.fail( function(xhr, textStatus, errorThrown) {
		var objData = $.parseJSON(xhr.responseText);
		showErrorPopup(objData.json.message);
		reset();
    	});
}

/**
* @fn reset
* @brief Clear user credentials from local storage
* @param none
* @return none
*/
function reset() {
	$("#email").val('');
	$("#password").val('');
}
