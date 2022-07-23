var checkUsername = false;
var checkLowerCase = false;
var checkUpperCase = false;
var checkNumber = false;
var checkLength = false;
var checkSpecialCharacter = false;
var checkMatchedPassword = false;
var checkFirstname = false;
var checkSurname = false;
var checkEmail = false;
var checkPhone = false;

// Function to format sign in data
function signUpFormat(form_id) {
    let uname = document.forms[form_id]["uname"].value;
    let psw = document.forms[form_id]["psw"].value;
    let confirm_psw = document.forms[form_id]["confirm-psw"].value;
    let firstname = document.forms[form_id]["firstname"].value;
    let surname = document.forms[form_id]["surname"].value;
    let gender = '';
    let email = document.forms[form_id]["email"].value;
    let address = '';
    let phone = document.forms[form_id]["phone"].value;
    let dateOfBirth = '';
    if (psw != confirm_psw) {
        document.getElementById("alert-not-match-password").style.display = "block";
        document.getElementById("alert-not-match-password").innerHTML = "Your password does not match!";
        document.getElementById("confirm-psw").style.backgroundColor = "lightcoral";
        document.getElementById("confirm-psw").style.color = "white";
        return false;
    }
    if (uname === "" || psw === "" || confirm_psw === "" || firstname === "" || surname === "" || email === "" || phone === "") {
        return false;
    }
    if (checkUsername === false || checkLowerCase === false || checkUpperCase === false || checkNumber === false || checkLength === false || checkSpecialCharacter === false || checkMatchedPassword === false || checkFirstname === false || checkSurname === false || checkEmail === false || checkPhone === false) {
        alert("Something went wrong! Please check your input.");
        return false;
    }
    let data = JSON.stringify(
        {"SignUp": "True", "uname": uname, "psw": psw, "firstname": firstname, "surname": surname, "gender": gender, "email": email, "address": address, "phone": phone, "dateOfBirth": dateOfBirth}
    );
    return data;
}

function SendToAndGetDataFromServer() {
    signUpData = signUpFormat('sign-up-form');
    if (signUpData === false) {
        return false;
    }
    //alert(signInData);
    /* Send data to server */
    var req = new XMLHttpRequest();
    req.open("POST", "/templates.signup.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(signUpData);

    /* Add event to wait until receiving data from server */
    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.sign_up_successfully == true) {
            username = received_data.username;
            document.getElementById("alert-sign-up-successfully").style.display = "block";
            setTimeout(function(){
                location.href = '/templates/signin.html';
            }, 700);
        }
        else {
            document.getElementById("alert-existed-account").style.display = "block";
            document.getElementById("alert-existed-account").innerHTML = "Invalid character(s) in <strong>username</strong>";
            document.getElementById("uname").style.backgroundColor = "lightcoral";
            document.getElementById("uname").style.color = "white";
        }
    });
}

function validateUsername() {
    let uname = document.forms["sign-up-form"]["uname"].value;
    const regexUsername = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (regexUsername.test(uname) == true) {
        document.getElementById("alert-existed-account").style.display = "block";
        document.getElementById("alert-existed-account").innerHTML = "Invalid character(s) in <strong>username</strong>";
        document.getElementById("uname").style.backgroundColor = "lightcoral";
        document.getElementById("uname").style.color = "white";
        checkUsername = false;
        return;
    }
    else {
        document.getElementById("alert-existed-account").style.display = "none";
        document.getElementById("alert-existed-account").innerHTML = "";
        document.getElementById("uname").style.backgroundColor = "transparent";
        document.getElementById("uname").style.color = "black";
    }

    let data = JSON.stringify(
        {"check-username": "True", "uname": uname}
    );
    var req = new XMLHttpRequest();
    req.open("POST", "/templates.signup.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    /* Add event to wait until receiving data from server */
    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.isExistedAccount == true) {
            document.getElementById("alert-existed-account").style.display = "block";
            document.getElementById("alert-existed-account").innerHTML = "<strong>Username existed!</strong>";
            document.getElementById("uname").style.backgroundColor = "lightcoral";
            document.getElementById("uname").style.color = "white";
            checkUsername = false;
        }
        else {
            document.getElementById("alert-existed-account").style.display = "none";
            document.getElementById("alert-existed-account").innerHTML = "";
            document.getElementById("uname").style.backgroundColor = "transparent";
            document.getElementById("uname").style.color = "black";
            checkUsername = true;
        }
    });
}

function validatePassword() {
    var myInput = document.getElementById("psw");
    var letter = document.getElementById("letter");
    var capital = document.getElementById("capital");
    var number = document.getElementById("number");
    var special_character = document.getElementById("special_character");
    var length = document.getElementById("length");

    document.getElementById("message").style.display = "block";

    // When the user clicks outside of the password field, hide the message box
    myInput.onblur = function() {
    document.getElementById("message").style.display = "none";
    }

    // When the user starts to type something inside the password field
    myInput.onkeyup = function() {
        // Validate lowercase letters
        var lowerCaseLetters = /[a-z]/g;
        
        if(myInput.value.match(lowerCaseLetters)) {  
            letter.classList.remove("invalid");
            letter.classList.add("valid");
            checkLowerCase = true;
        } else {
            letter.classList.remove("valid");
            letter.classList.add("invalid");
            checkLowerCase = false;
        }

        // Validate capital letters
        var upperCaseLetters = /[A-Z]/g;
        if(myInput.value.match(upperCaseLetters)) {  
            capital.classList.remove("invalid");
            capital.classList.add("valid");
            checkUpperCase = true;
        } else {
            capital.classList.remove("valid");
            capital.classList.add("invalid");
            checkUpperCase = false;
        }

        // Validate numbers
        var numbers = /[0-9]/g;
        if(myInput.value.match(numbers)) {  
            number.classList.remove("invalid");
            number.classList.add("valid");
            checkNumber = true;
        } else {
            number.classList.remove("valid");
            number.classList.add("invalid");
            checkNumber = false;
        }

        // Validate special characters
        var specialCharacters = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;
        if(myInput.value.match(specialCharacters)) {  
            special_character.classList.remove("invalid");
            special_character.classList.add("valid");
            checkSpecialCharacter = true;
        } else {
            special_character.classList.remove("valid");
            special_character.classList.add("invalid");
            checkSpecialCharacter = false;
        }

        // Validate length
        if(myInput.value.length >= 6) {
            length.classList.remove("invalid");
            length.classList.add("valid");
            checkLength = true;
        } else {
            length.classList.remove("valid");
            length.classList.add("invalid");
            checkLength = false;
        }

        if (checkLength == false || checkLowerCase == false || checkUpperCase == false || checkSpecialCharacter == false || checkNumber == false) {
            document.getElementById("alert-wrong-password-format").style.display = "block";
            document.getElementById("alert-wrong-password-format").innerHTML = "Invalid <strong>password</strong> format";
            document.getElementById("psw").style.backgroundColor = "lightcoral";
            document.getElementById("psw").style.color = "white";
        }
        else {
            document.getElementById("alert-wrong-password-format").style.display = "none";
            document.getElementById("alert-wrong-password-format").innerHTML = "";
            document.getElementById("psw").style.backgroundColor = "transparent";
            document.getElementById("psw").style.color = "black";
        }
    }
}

function validateReenterPassword() {
    var psw = document.getElementById("psw").value;
    var confirm_psw = document.getElementById("confirm-psw").value;
    if(psw != confirm_psw) {
        document.getElementById("alert-not-match-password").style.display = "block";
        document.getElementById("alert-not-match-password").innerHTML = "Your password does not match!";
        document.getElementById("confirm-psw").style.backgroundColor = "lightcoral";
        document.getElementById("confirm-psw").style.color = "white";
        checkMatchedPassword = false;
    }
    else {
        document.getElementById("alert-not-match-password").style.display = "none";
        document.getElementById("alert-not-match-password").innerHTML = "";
        document.getElementById("confirm-psw").style.backgroundColor = "transparent";
        document.getElementById("confirm-psw").style.color = "black";
        checkMatchedPassword = true;
    }
}

function validateFirstname() {
    let firstnameInput = document.getElementById("firstname").value;
    const firstnameRegex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~(0-9)+]/;
    if (firstnameRegex.test(firstnameInput)){
        if (firstnameInput.length === 0) {
            document.getElementById("alert-firstname").style.display = "none";
            document.getElementById("alert-firstname").innerHTML = "";
            document.getElementById("firstname").style.backgroundColor = "transparent";
            document.getElementById("firstname").style.color = "black";
            checkFirstname = false;
        }
        else {
            document.getElementById("alert-firstname").style.display = "block";
            document.getElementById("alert-firstname").innerHTML = "<strong>First name</strong> may contain invalid character(s)!";
            document.getElementById("firstname").style.backgroundColor = "lightcoral";
            document.getElementById("firstname").style.color = "white";
            checkFirstname = false;
        }
    }
    else {
        document.getElementById("alert-firstname").style.display = "none";
        document.getElementById("alert-firstname").innerHTML = "";
        document.getElementById("firstname").style.backgroundColor = "transparent";
        document.getElementById("firstname").style.color = "black";
        checkFirstname = true;
    }
}

function validateSurname() {
    let surnameInput = document.getElementById("surname").value;
    const surnameRegex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~(0-9)+]/;
    if (surnameRegex.test(surnameInput)){
        if (surnameInput.length === 0) {
            document.getElementById("alert-surname").style.display = "none";
            document.getElementById("alert-surname").innerHTML = "";
            document.getElementById("surname").style.backgroundColor = "transparent";
            document.getElementById("surname").style.color = "black";
            checkSurname = false;
        }
        else {
            document.getElementById("alert-surname").style.display = "block";
            document.getElementById("alert-surname").innerHTML = "<strong>Surname</strong> may contain invalid character(s)!";
            document.getElementById("surname").style.backgroundColor = "lightcoral";
            document.getElementById("surname").style.color = "white";
            checkSurname = false;
        }
    }
    else {
        document.getElementById("alert-surname").style.display = "none";
        document.getElementById("alert-surname").innerHTML = "";
        document.getElementById("surname").style.backgroundColor = "transparent";
        document.getElementById("surname").style.color = "black";
        checkSurname = true;
    }
}

function validateEmail() {
    let emailInput = document.getElementById("email").value;
    const emailRegex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (!emailRegex.test(emailInput)){
        if (emailInput.length === 0) {
            document.getElementById("alert-email").style.display = "none";
            document.getElementById("alert-email").innerHTML = "";
            document.getElementById("email").style.backgroundColor = "transparent";
            document.getElementById("email").style.color = "black";
            checkEmail = false;
        }
        else {
            document.getElementById("alert-email").style.display = "block";
            document.getElementById("alert-email").innerHTML = "Invalid <strong>email</strong> format!";
            document.getElementById("email").style.backgroundColor = "lightcoral";
            document.getElementById("email").style.color = "white";
            checkEmail = false;
        }
    }
    else {
        document.getElementById("alert-email").style.display = "none";
        document.getElementById("alert-email").innerHTML = "";
        document.getElementById("email").style.backgroundColor = "transparent";
        document.getElementById("email").style.color = "black";
        checkEmail = true;
    }
}

function validatePhone() {
    let phoneInput = document.getElementById("phone").value;
    const phoneRegex = /^([0-9]+)$/;
    if (!phoneRegex.test(phoneInput)){
        if (phoneInput.length === 0) {
            document.getElementById("alert-phone").style.display = "none";
            document.getElementById("alert-phone").innerHTML = "";
            document.getElementById("phone").style.backgroundColor = "transparent";
            document.getElementById("phone").style.color = "black";
            checkPhone = false;
        }
        else {
            document.getElementById("alert-phone").style.display = "block";
            document.getElementById("alert-phone").innerHTML = "Invalid <strong>phone number</strong> format";
            document.getElementById("phone").style.backgroundColor = "lightcoral";
            document.getElementById("phone").style.color = "white";
            checkPhone = false;
        }
    }
    else {
        document.getElementById("alert-phone").style.display = "none";
        document.getElementById("alert-phone").innerHTML = "";
        document.getElementById("phone").style.backgroundColor = "transparent";
        document.getElementById("phone").style.color = "black";
        checkPhone = true;
    }
}