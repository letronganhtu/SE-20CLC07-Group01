var checkFirstname = true;
var checkSurname = true;
var checkGender = true;
var checkEmail = true;
var checkPhone = true;
var checkDOB = true;
var newAvatar;
var newCover;

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
    req.open("POST", "/templates/profile.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.getProfileInformation == true) {
            sessionStorage.clear();
            var username = received_data.uname;
            var password = received_data.psw;
            var firstname = received_data.firstname;
            var surname = received_data.surname;
            var gender = received_data.gender;
            var address = received_data.address;
            var email = received_data.email;
            var phone = received_data.phone;
            var dateOfBirth = received_data.dateOfBirth;
            var avatar = received_data.avatar;
            var cover = received_data.cover;
            var accounttype = received_data.accounttype;
            var createdtime = received_data.createdtime;
            var status = received_data.status;
            var available = received_data.available;
            var endofsuspendtime = received_data.endofsuspendtime;

            sessionStorage.setItem("username", username);
            sessionStorage.setItem("password", password);
            sessionStorage.setItem("firstname", firstname);
            sessionStorage.setItem("surname", surname);
            sessionStorage.setItem("gender", gender);
            sessionStorage.setItem("address", address);
            sessionStorage.setItem("email", email);
            sessionStorage.setItem("phone", phone);
            sessionStorage.setItem("dateOfBirth", dateOfBirth);
            sessionStorage.setItem("avatar", avatar);
            sessionStorage.setItem("cover", cover);
            sessionStorage.setItem("accounttype", accounttype);
            sessionStorage.setItem("createdtime", createdtime);
            sessionStorage.setItem("status", status);
            sessionStorage.setItem("available", available);
            sessionStorage.setItem("endofsuspendtime", endofsuspendtime);
        
            username = sessionStorage.getItem("username");
            firstname = sessionStorage.getItem("firstname");
            surname = sessionStorage.getItem("surname");
            avatar = sessionStorage.getItem("avatar");
            cover = sessionStorage.getItem("cover");
            document.getElementById("profile-name").innerHTML = username;
            document.getElementById("onpage-profile-username").innerHTML = '@' + username;
            document.getElementById("onpage-profile-fullname").innerHTML = firstname + ' ' + surname;
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

            password = sessionStorage.getItem("password");
            gender = sessionStorage.getItem("gender");
            address = sessionStorage.getItem("address");
            email = sessionStorage.getItem("email");
            phone = sessionStorage.getItem("phone");
            dateOfBirth = sessionStorage.getItem("dateOfBirth");
            accounttype = sessionStorage.getItem("accounttype");
            createdtime = sessionStorage.getItem("createdtime");
            status = sessionStorage.getItem("status");
            available = sessionStorage.getItem("available");
            endofsuspendtime = sessionStorage.getItem("endofsuspendtime");

            document.getElementById("firstname").value = firstname;
            document.getElementById("surname").value = surname;
            document.getElementById("gender").value = gender;
            document.getElementById("address").value = address;
            document.getElementById("email").value = email;
            document.getElementById("phone").value = phone;
            document.getElementById("dateOfBirth").value = dateOfBirth;
        }
    });
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


function editProfileFormat(form_id) {
    let uname = sessionStorage.getItem('username');
    let firstname = document.forms[form_id]["firstname"].value;
    let surname = document.forms[form_id]["surname"].value;
    let gender = document.forms[form_id]["gender"].value;
    let email = document.forms[form_id]["email"].value;
    let address = document.forms[form_id]["address"].value;
    let phone = document.forms[form_id]["phone"].value;
    let dateOfBirth = document.forms[form_id]["dateOfBirth"].value;
    let avatar = document.getElementById("main-avatar-img").src;
    avatar = String(avatar).split(',');
    avatar = avatar[1].trim();
    let cover = document.getElementById("cover-img").src;
    cover = String(cover).split(',');
    cover = cover[1].trim();
    if (firstname === "" || surname === "" || email === "" || phone === "" || dateOfBirth === "" || gender === "" || dateOfBirth === "") {
        return false;
    }
    if (cover === true) {
        return false;
    }
    if (checkFirstname === false || checkSurname === false || checkGender === false || checkEmail === false || checkPhone === false || checkDOB === false) {
        alert("Something went wrong! Please check your input.");
        return false;
    }
    let data = JSON.stringify(
        {"EditProfile": "True", "uname": uname, "firstname": firstname, "surname": surname, "gender": gender, "email": email, "address": address, "phone": phone, "dateOfBirth": dateOfBirth, "avatar": avatar, "cover": cover}
    );
    return data;
}

function sendSubmit() {
    if (document.forms["edit-profile-form"]["gender"].value != "") {
        checkGender = true;
    }
    else {
        checkGender = false;
    }
    if (document.forms["edit-profile-form"]["dateOfBirth"].value != "") {
        checkDOB = true;
    }
    else {
        checkDOB = false;
    }
    editProfileData = editProfileFormat('edit-profile-form');
    if (editProfileData === false) {
        return false;
    }
    var req = new XMLHttpRequest();
    req.open("POST", "/templates/profile.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(editProfileData);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.edit_successfully == true) {
            firstname = received_data.firstname;
            surname = received_data.surname;
            gender = received_data.gender;
            address = received_data.address;
            email = received_data.email;
            phone = received_data.phone;
            dateOfBirth = received_data.dateOfBirth;
            sessionStorage.setItem("firstname", firstname);
            sessionStorage.setItem("surname", surname);
            sessionStorage.setItem("gender", gender);
            sessionStorage.setItem("address", address);
            sessionStorage.setItem("email", email);
            sessionStorage.setItem("phone", phone);
            sessionStorage.setItem("dateOfBirth", dateOfBirth);
            document.getElementById("alert-edit-successfully").style.display = "block";
            setTimeout(function() {
                location.reload();
            }, 1000);
        }
    });
}

function uploadAvatar() {
    document.getElementById('upload-avatar').click();
    document.getElementById('upload-avatar').addEventListener('change', function(){
        if (this.files[0] ) {
            var picture = new FileReader();
            picture.readAsDataURL(this.files[0]);
            picture.addEventListener('load', function(event) {
                document.getElementById('main-avatar-img').setAttribute('src', event.target.result);
                //alert(event.target.result);
                document.getElementById('main-avatar-img').style.width = "200px";
                document.getElementById('main-avatar-img').style.height = "200px";
                document.getElementById("delete-avatar").disabled = false;
                document.getElementById("delete-avatar").style.opacity = 1;
                document.getElementById("delete-avatar").style.cursor = "pointer";
                //newAvatar = String(event.target.result);
                //newAvatar = newAvatar.split(',')[1];
                //newAvatar = newAvatar.trim();
                document.getElementById('upload-avatar').value = "";
            });
        }
    });
}

function deleteAvatar() {
    document.getElementById('main-avatar-img').setAttribute('src', "data:image/png;base64," + sessionStorage.getItem("anonymousAvatar"));
    document.getElementById('main-avatar-img').style.width = "200px";
    document.getElementById('main-avatar-img').style.height = "200px";
    document.getElementById("delete-avatar").disabled = true;
    document.getElementById("delete-avatar").style.opacity = 0.5;
    document.getElementById("delete-avatar").style.cursor = "no-drop";
}

function uploadCover() {
    document.getElementById('upload-cover').click();
    document.getElementById('upload-cover').addEventListener('change', function(){
    if (this.files[0] ) {
        var picture = new FileReader();
        picture.readAsDataURL(this.files[0]);
        picture.addEventListener('load', function(event) {
            document.getElementById('cover-img').setAttribute('src', event.target.result);
            //alert(event.target.result);
            document.getElementById('cover-img').style.width = "800px";
            document.getElementById('cover-img').style.height = "260px";
            document.getElementById("delete-cover").disabled = false;
            document.getElementById("delete-cover").style.opacity = 1;
            document.getElementById("delete-cover").style.cursor = "pointer";
            //newAvatar = String(event.target.result);
            //newAvatar = newAvatar.split(',')[1];
            //newAvatar = newAvatar.trim();
            document.getElementById('upload-cover').value = "";
        });
    }
    });
}

function deleteCover() {
    document.getElementById('cover-img').setAttribute('src', "data:image/png;base64," + sessionStorage.getItem("anonymousCover"));
    //alert(event.target.result);
    document.getElementById('cover-img').style.width = "800px";
    document.getElementById('cover-img').style.height = "260px";
    document.getElementById("delete-cover").disabled = true;
    document.getElementById("delete-cover").style.opacity = 0.5;
    document.getElementById("delete-cover").style.cursor = "no-drop";
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
