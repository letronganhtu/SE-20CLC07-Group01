var checkLowerCase = false;
var checkUpperCase = false;
var checkNumber = false;
var checkLength = false;
var checkSpecialCharacter = false;
var checkTheSamePassword = false;
var checkMatchedPassword = false;


function signOut() {
    let uname = sessionStorage.getItem("username");
    let data = JSON.stringify(
        {"SignOut": "True", "uname": uname}
    );
    var req = new XMLHttpRequest();
    req.open("POST", "/templates/profile.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);
    
    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.SignOut == true) {
            localStorage.clear();
            location.href = "/templates/signin.html";
        }
    });
}


function getProfileInformation() {
    let uname = sessionStorage.getItem("username");
    let data = JSON.stringify(
        {"GetProfileInformation": "True", "uname": uname}
    );
    var req = new XMLHttpRequest();
    req.open("POST", "/templates/change-password.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.getProfileInformation == true) {
            sessionStorage.clear();
            var username = received_data.uname;
            var firstname = received_data.firstname;
            var surname = received_data.surname;
            var avatar = received_data.avatar;
            var cover = received_data.cover;
            var available = received_data.available;
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('avatar', avatar);
            sessionStorage.setItem('available', available);
            username = sessionStorage.getItem('username');

            document.getElementById("profile-name").innerHTML = username;
            document.getElementById("your-username").value = username;
            document.getElementById("onpage-profile-username").innerHTML = '@' + username;
            document.getElementById("onpage-profile-fullname").innerHTML = surname + ' ' + firstname;
            //var img = document.createElement("img");
            //img.src = "data:image/;base64," + avatar;
            //console.log(img.src);
            var avatar_string = "data:image/;base64," + avatar;
            document.getElementById("avatar-icon").src = avatar_string;
            document.getElementById("main-avatar-img").src = avatar_string;
            var cover_string = "data:image/;base64," + cover;
            document.getElementById("cover-img").src = cover_string;
            document.getElementById("cover-img").style.width = "800px";
            document.getElementById("cover-img").style.height = "260px";
        }
    });
}

function sendSubmit() {
    let form_id = "change-password-form"
    let username = document.forms[form_id]["your-username"].value;
    let oldPassword = document.forms[form_id]["old-password"].value;
    let newPassword = document.forms[form_id]["new-password"].value;
    let confirmPassword = document.forms[form_id]["confirm-password"].value;

    if (username === "" || oldPassword === "" || newPassword === "" || confirmPassword === "") {
        return false;
    }
    if (!checkLowerCase || !checkLowerCase || !checkUpperCase || !checkNumber || !checkLength || !checkSpecialCharacter || !checkMatchedPassword || checkTheSamePassword) {
        alert("Something went wrong! Please check your input.");
        return false;
    }

    let data = JSON.stringify(
        {"changePassword": "True", "username": username, "oldPassword": oldPassword, "newPassword": newPassword}
    );

    var req = new XMLHttpRequest();
    req.open("POST", "/templates/change-password.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.changePassword == true) {
            document.getElementById("alert-edit-successfully").style.display = "block";
            setTimeout(function() {
                location.reload();
            }, 500);
        }
        else {
            document.getElementById("alert-wrong-password").style.display = 'block';
            setTimeout(function() {
                document.getElementById("alert-wrong-password").style.transition = 'all .3 ease';
                document.getElementById("alert-wrong-password").style.display = 'none';
            }, 3000);
        }
    });
}


function getAnonymousAvatarAndCover() {
    data = JSON.stringify({"getAnonymousAvatarAndCover": true});
    var req = new XMLHttpRequest();
    req.open("POST", "/templates/profile.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.check == true) {
            sessionStorage.setItem("anonymousAvatar", received_data.avatar);
            sessionStorage.setItem("anonymousCover", received_data.cover);
        }
    });
}


function validatePassword() {
    var oldPassword = document.getElementById('old-password');
    var myInput = document.getElementById("new-password");
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

        // Check if new password is the same with old password
        if (myInput.value === oldPassword.value) {
            document.getElementById("alert-wrong-password-format").style.display = "block";
            document.getElementById("alert-wrong-password-format").innerHTML = "Your old and new password <strong>must be different!</strong>";
            document.getElementById("new-password").style.backgroundColor = "lightcoral";
            document.getElementById("new-password").style.color = "white";
            checkTheSamePassword = true;
            return;
        }
        else {
            document.getElementById("alert-wrong-password-format").style.display = "none";
            document.getElementById("alert-wrong-password-format").innerHTML = "";
            document.getElementById("new-password").style.backgroundColor = "transparent";
            document.getElementById("new-password").style.color = "black";
            checkTheSamePassword = false;
        }

        // Check if the new password satisfies requirements
        if (checkLength == false || checkLowerCase == false || checkUpperCase == false || checkSpecialCharacter == false || checkNumber == false) {
            document.getElementById("alert-wrong-password-format").style.display = "block";
            document.getElementById("alert-wrong-password-format").innerHTML = "Invalid <strong>password</strong> format!";
            document.getElementById("new-password").style.backgroundColor = "lightcoral";
            document.getElementById("new-password").style.color = "white";
        }
        else {
            document.getElementById("alert-wrong-password-format").style.display = "none";
            document.getElementById("alert-wrong-password-format").innerHTML = "";
            document.getElementById("new-password").style.backgroundColor = "transparent";
            document.getElementById("new-password").style.color = "black";
        }
    }
}

function validateReenterPassword() {
    var psw = document.getElementById("new-password").value;
    var confirm_psw = document.getElementById("confirm-password").value;
    if(psw != confirm_psw) {
        document.getElementById("alert-not-match-password").style.display = "block";
        document.getElementById("alert-not-match-password").innerHTML = "Your password does not match!";
        document.getElementById("confirm-password").style.backgroundColor = "lightcoral";
        document.getElementById("confirm-password").style.color = "white";
        checkMatchedPassword = false;
    }
    else {
        document.getElementById("alert-not-match-password").style.display = "none";
        document.getElementById("alert-not-match-password").innerHTML = "";
        document.getElementById("confirm-password").style.backgroundColor = "transparent";
        document.getElementById("confirm-password").style.color = "black";
        checkMatchedPassword = true;
    }
}
