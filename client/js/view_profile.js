/**
* Global variable. 
*/
var url = '/v1/users/profiles'; 

/**
* @fn showMessageBody
* @brief Send Get request to server for user profile
* @param url url of server
* @return none
*/
sendGetRequestToServer(url, null, function(err, objData) {
	if(err) {
		alert(JSON.stringify(objData));
	}
	else {
		localStorage.setItem("profileData", JSON.stringify(objData));
		viewUserProfile();
	}
});

/**
* @fn viewUserProfile
* @brief Fill user profile data to form
* @param none
* @return none
*/
function viewUserProfile() {

	var profileData = $.parseJSON(localStorage.getItem("profileData"));
	console.log(profileData);
	console.log(profileData.json.first_name);
	$("#first_name").html(profileData.json.first_name);
	$("#last_name").html(profileData.json.last_name);
	$("#date_of_birth").html(profileData.json.date_of_birth);
	$("#occupation").html(profileData.json.occupation);
	$("#mobile_number").html(profileData.json.mobile_number);
	$('input[name="gender"]').val([profileData.json.gender]);
	$('input[name="married"]').val([profileData.json.marital_status]);
	$("#spouse_first_name").html(profileData.json.spouse_first_name);
	$("#spouse_last_name").html(profileData.json.spouse_last_name);
	$("#spouse_date_of_birth").html(profileData.json.spouse_date_of_birth);
	$("#spouse_occupation").html(profileData.json.spouse_occupation);
	$("#spouse_mobile_number").html(profileData.json.spouse_mobile_number);
	$("#spouse_email").html(profileData.json.spouse_email);
	$('input[name="spouse_gender"]').val([profileData.json.spouse_gender]);
	$("#street").html(profileData.json.address_street);
	$("#locality").html(profileData.json.address_locality);
	$("#state").html(profileData.json.address_state);
	$("#country").html(profileData.json.address_country);
	$("#zipcode").html(profileData.json.address_zip);
	$("#child_first_name").html(profileData.json.children[0].child_first_name);
	$("#child_last_name").html(profileData.json.children[0].child_last_name);
	$("#child_date_of_birth").html(profileData.json.children[0].child_date_of_birth);
	$('input[name="child_gender"]').val([profileData.json.children[0].child_gender]);
}


