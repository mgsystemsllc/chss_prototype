
/**
* Globals. 
*/
var profileMethod = "POST";

/**
* @fn createUserProfile
* @brief Read and send user profile data to server
* @param none
* @return none
*/
function createUserProfile() {
	
	if($("#first_name").val() === '') return;
	if($("#last_name").val() === '') return;
	if($("#dob").val() === '') return;
	if($("#occupation").val() === '') return;
	if($("#mobile_number").val() === '') return;

	if($("#spouse_first_name").val() === '') return;
	if($("#spouse_last_name").val() === '') return;
	if($("#spouse_mobile_number").val() === '') return;
	if($("#spouse_email").val() === '') return;
	if($("#spouse_occupation").val() === '') return;
	if($("#spouse_dob").val() === '') return;

	if($("#address_street").val() === '') return;
	if($("#address_locality").val() === '') return;
	if($("#address_state").val() === '') return;
	if($("#address_country").val() === '') return;
	if($("#address_zipcode").val() === '') return;

	if($("#child_first_name").val() === '') return;
	if($("#child_last_name").val() === '') return;
	if($("#child_dob").val() === '') return;

	var objJson = {
		first_name : $("#first_name").val(),
		last_name : $("#last_name").val(),
		gender : $("input[name=gender]:checked").val(),
		date_of_birth : $("#dob").val(),
		marital_status : $("input[name=married]:checked").val(),
		occupation : $("#occupation").val(),
		mobile_number : $("#mobile_number").val(),
		spouse_first_name : $("#spouse_first_name").val(),
		spouse_last_name : $("#spouse_last_name").val(),
		spouse_mobile_number : $("#spouse_mobile_number").val(),
		spouse_email : $("#spouse_email").val(),
		spouse_occupation : $("#spouse_occupation").val(),
		spouse_date_of_birth : $("#spouse_dob").val(),
		spouse_gender : $("input[name=spouse_gender]:checked").val(),
		address_street : $("#address_street").val(),
		address_locality : $("#address_locality").val(),
		address_state : $("#address_state").val(),
		address_country : $("#address_country").val(),
		address_zip : $("#address_zipcode").val(),
		child_first_name : $("#child_first_name").val(),
		child_last_name : $("#child_last_name").val(),
		child_date_of_birth : $("#child_dob").val(),
		child_gender : $("input[name=child_gender]:checked").val()
	};
	
	var url = '/v1/users/profiles'; 
	
	if(profileMethod === "POST") {
		console.log("POST");
		sendPostRequestToServer(url, objJson, function(err, objData) {
			if(err) {
				showErrorPopup(objData.json.message);
				$("#password").val('');
			}
			else {
				window.location = objData.json.message;
			}
		});
	}
	else {
		console.log("PUT");
		sendPutRequestToServer(url, objJson, function(err, objData) {
			if(err) {
				showErrorPopup(objData.json.message);
				$("#password").val('');
			}
			else {
				window.location = objData.json.message;
			}
		});
	}
}

/**
* @fn fillUserProfile
* @brief Fill data in profile form
* @param none
* @return none
*/
function fillUserProfile() {

	if(typeof localStorage.getItem("profileData") === "undefined")	{

		profileMethod = "POST";
		return;
	}
	else {
		var profileData = $.parseJSON(localStorage.getItem("profileData"));
		if (typeof profileData.json.first_name === "undefined")	{
			profileMethod = "POST";
			return;
		}
		else {
			profileMethod = "PUT";
			console.log(profileData);
			console.log(profileData.json.first_name);

			$("#first_name").val(profileData.json.first_name);
			$("#last_name").val(profileData.json.last_name);
			$("#dob").val(profileData.json.date_of_birth);
			$("#occupation").val(profileData.json.occupation);
			$("#mobile_number").val(profileData.json.mobile_number);
			$('input[name="gender"]').val([profileData.json.gender]);
			$('input[name="married"]').val([profileData.json.marital_status]);
			$("#spouse_first_name").val(profileData.json.spouse_first_name);
			$("#spouse_last_name").val(profileData.json.spouse_last_name);
			$("#spouse_dob").val(profileData.json.spouse_date_of_birth);
			$("#spouse_occupation").val(profileData.json.spouse_occupation);
			$("#spouse_mobile_number").val(profileData.json.spouse_mobile_number);
			$("#spouse_email").val(profileData.json.spouse_email);
			$('input[name="spouse_gender"]').val([profileData.json.spouse_gender]);
			$("#address_street").val(profileData.json.address_street);
			$("#address_locality").val(profileData.json.address_locality);
			$("#address_state").val(profileData.json.address_state);
			$("#address_country").val(profileData.json.address_country);
			$("#address_zipcode").val(profileData.json.address_zip);
			$("#child_first_name").val(profileData.json.children[0].child_first_name);
			$("#child_last_name").val(profileData.json.children[0].child_last_name);
			$("#child_dob").val(profileData.json.children[0].child_date_of_birth);
			$('input[name="child_gender"]').val([profileData.json.children[0].child_gender]);
		}
	}
}

fillUserProfile();
