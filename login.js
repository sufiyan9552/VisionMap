$(document).on('click', '#signin', function () {
    var email = $('#txtemailid').val();
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var cesiumId = $('#txtcesiumion').val();

    if (emailRegex.test(email)) {
        showMessage("OTP sent to email");
        $('#signin').css('display', 'none');
        $('#txtcesiumion').css('display', 'none'); 
        $('#txtotp').css('display', 'none');
        $('#verifyotp').css('display', 'block');
        $('#Cancelsignin').css('display', 'block');
        $('#txtotp').css('display', 'block');
        $('#txtemailid').css('display', 'none');
        sessionStorage.setItem('userEmail', email);
        sessionStorage.setItem('cesiumIonId', cesiumId);
        // window.location.href = 'index.html';

    } else {
        showMessage("Please Enter Correct Email!");
    }

    // if (emailRegex.test(email)) {
    //     document.getElementById("errorInfo").style.display = "none";
    //     $("#messageInfoVal").html('');
    //     showLoading();
    //     var settings = {
    //         "url": "http://localhost:8080/api/generate-otp",
    //         "method": "POST",
    //         "timeout": 0,
    //         "headers": {
    //             "Content-Type": "application/x-www-form-urlencoded"
    //         },
    //         "data": {
    //             "email": email
    //         }
    //     };
    //     $.ajax(settings).done(function (response, textStatus, jqXHR) {
    //         hideLoading();
    //         if (jqXHR.status == 201) {
    //             sessionStorage.setItem('userEmail', email);
    //             window.location.href = 'index.html';
    //         } else if (jqXHR.status == 200) {
    //             showMessage("OTP sent to email");
    //             $('#signin').css('display', 'none');
    //             $('#txtotp').css('display', 'none');
    //             $('#verifyotp').css('display', 'block');
    //             $('#Cancelsignin').css('display', 'block');
    //             $('#txtotp').css('display', 'block');
    //             $('#txtemailid').css('display', 'none');
    //             sessionStorage.setItem('userEmail', email);
    //         } else {
    //             showMessage("Something Failure please Wait")
    //         }
    //     }).fail(function (jqXHR, textStatus, errorThrown) {
    //         console.log('Request failed');
    //         console.log('Error:', errorThrown);
    //         console.log('HTTP Status Code:', jqXHR.status);
    //     });

    // } else {
    //     showMessage("Please Enter Correct Email!");
    // }

});
//*****************Cancel Button Event*********************************
$(document).on('click', '#Cancelsignin', function () {
    $('#signin').css('display', 'block');
    $('#txtotp').css('display', 'block');
    $('#txtcesiumion').css('display', 'block'); 
    $('#verifyotp').css('display', 'none');
    $('#Cancelsignin').css('display', 'none');
    $('#txtotp').css('display', 'none');
    $('#txtemailid').css('display', 'block');

});
//*****************Verify OTP Button Event*********************************
$(document).on('click', '#verifyotp', function () {
    var otp = $('#txtotp').val();
    if(otp == "123456"){
        window.location.href = "index.html";
    }
    else{
        showMessage("Enter Correct OTP")
    }
    // var email = sessionStorage.getItem('userEmail');
    // showLoading();
    // if (otp && email) {
    //     var url = `http://localhost:8080/api/verify-otp?otp=${encodeURIComponent(otp)}&email=${encodeURIComponent(email)}`;

    //     var settings = {
    //         "url": url,
    //         "method": "POST",
    //         "timeout": 0
    //     };

    //     $.ajax(settings).done(function (response, textStatus, jqXHR) {
    //         hideLoading();
    //         if (jqXHR.status === 200) {
    //             window.location.href = "index.html";
    //         } else if (jqXHR.status === 401) {
    //             showMessage("Please enter the correct OTP!");
    //         } else {
    //             showMessage("Something went wrong. Please wait!");
    //         }
    //     }).fail(function (jqXHR, textStatus, errorThrown) {
    //         showMessage("Request failed: " + textStatus);
    //     });
    // } else {
    //     showMessage("OTP or email is missing.");
    // }
});




function showMessage(msg) {
    document.getElementById("errorInfo").style.display = "block";
    $("#messageInfoVal").html(msg);
    setTimeout(() => {
        document.getElementById("errorInfo").style.display = "none";
        $("#messageInfoVal").html('');
    }, 4000);
}

//*****************************Loader******************************** */

// Function to show the loading spinner
function showLoading() {
    document.getElementById('loading-overlay').style.display = 'flex';
}

// Function to hide the loading spinner
function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
}

