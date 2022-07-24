/*// Function to set cookie
function setCookie(list1, list2, exdays, path) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString()
    for(var i=0; i < list1.length; i++) {
        document.cookie = list1[i] + "=" + list2[i];
    }
    document.cookie += expires + ";path=" + path;
}

// Function to get cookie
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Function to delete cookie
function deleteCookie( name, path ) {
    if( get_cookie( name ) ) {
      document.cookie = name + "=" +
        ((path) ? ";path="+path:"") +
        ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
  }*/

// Function to save data to txt file
function saveFile(path){
    fetch(path)
        .then(response => response.text())
        .then(text => document.getElementById("title").innerHTML = text)
}

// Function to hide preloader
function hidePreloader() {
    window.onload = function() {
        setTimeout(function(){
            document.querySelector('.loader-wrapper').style.display = "none";
        }, 200);
    }
}

// Function to show preloader
function setLoading(id) {
    document.getElementById(id).style.display = "block";

    setTimeout(function(){
        document.getElementById(id).style.display = "none";
    }, 00);
}

// Function to open sign in page
function OpenSignInPage() {
    location.href = '/templates/signin.html';
}

// Function to sign up page
function OpenSignUpPage() {
    location.href = '/templates/signup.html';
}

// Function to open main page
function OpenMainPage() {
    location.href = '/templates/mainpage.html';
}

// Function to sign out
function signOut() {
    let uname = sessionStorage.getItem("username");
    let data = JSON.stringify(
        {"SignOut": "True", "uname": uname}
    );
    var req = new XMLHttpRequest();
    req.open("POST", "/templates.signup.html", true);
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

// Function to check guest
function checkGuest() {
    if (username === "GUEST") {
        document.getElementById("edit-profile").style.display = 'none';
        document.getElementById("change-username").style.display = 'none';
        document.getElementById("change-password").style.display = 'none';
        document.getElementById("my-recipes").style.display = 'none';
        document.getElementById("my-favorite").style.display = 'none';
    }
}
