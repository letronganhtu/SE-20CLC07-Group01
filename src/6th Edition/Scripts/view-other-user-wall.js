function viewProfile() {
    let username = sessionStorage.getItem('viewUser');
    
    if (sessionStorage.getItem('viewUser') === sessionStorage.getItem('username')) {
        location.href = '/templates/my-post.html';
    }

    let data = JSON.stringify(
        {"viewProfile": "True", "username": username}
    );
    var req = new XMLHttpRequest();
    req.open("POST", "/templates/my-post.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.viewProfile == true) {
            avatar = received_data.avatar;
            fullname = received_data.fullname;
            username = received_data.username;
            document.getElementById('in-page-avatar').src = "data:image/png;base64," + avatar;
            document.getElementById('fullname').innerHTML = fullname;
            document.getElementById('username').innerHTML = '@' + username;
        }
    });
}

function getTheirRecipes() {
    username = sessionStorage.getItem('viewUser');

    let data = JSON.stringify(
        {"getMyRecipes": "True", "username": username}
    );
    var req = new XMLHttpRequest();
    req.open("POST", "/templates/my-post.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.getMyRecipes == true) {
            posts = received_data.posts;
            if (posts.length === 0) {
                document.getElementById('no-recipes-div').style.display = 'block';
            }
            else {
                document.getElementById('no-recipes-div').style.display = 'none';
                HTMLpost = '';
                for(let i = 0; i < posts.length; i++) {
                    //[postID, recipeName, thumbnail, calories]
                    postID = String(posts[i][0]);
                    recipeName = posts[i][1];
                    thumbnail = "data:image/png;base64," + posts[i][2];
                    calories = String(posts[i][3]);
                    
                    HTMLpost += `<a href="javascript:viewDetailPost('recipe-${String(i + 1)}')"><div id="recipe-${String(i + 1)}" class="recipe">
                                    <div class="recipe-name-div">
                                        <span id="recipe-name-${String(i + 1)}" class="recipe-name">${recipeName}</span>
                                    </div>
                                    <div class="calories-div">
                                        <span id="calories-${String(i + 1)}" class="calories"><i class="fa fa-fire"></i>&nbsp${calories} kcal</span>
                                    </div>
                                    <div class="thumbnail-div">
                                        <img src="${thumbnail}" id="thumbnail-${String(i + 1)}" class="thumbnail">
                                    </div>
                                </div></a>
                                <hr></hr>`;
                    let id = `my-recipe-${String(i + 1)}`;
                    sessionStorage.setItem(id, postID);
                }
                document.getElementById('my-recipes-div').innerHTML += HTMLpost;
            }
        }
    });
}

function viewDetailPost(id) {
    pos = id.split('-');
    pos = pos[1];
    var savedRecipeID = "my-recipe-" + String(pos);
    postID = sessionStorage.getItem(savedRecipeID);
    if (postID === null) {
        alert("No post was uploaded!");
        return;
    }
    sessionStorage.setItem("watchingPostID", postID);
    location.href = '/templates/detail-post.html';
}

function displayAccountReportPopup() {
    let height = document.getElementById('my-recipes-div').offsetHeight + 600 + 'px';
    document.getElementById('report-account-popup-div').style.height = height;
    document.getElementById('report-account-popup-div').style.display = "block";
}

function chooseReportChoice(choice) {
    document.getElementById('impersonate-someone').style.backgroundColor = 'rgb(240, 240, 240)';
    document.getElementById('posting-inappropriate-contents').style.backgroundColor = 'rgb(240, 240, 240)';

    impersonateSomeone = false;
    postingInappropriateContents = false;

    if (choice === 'impersonate-someone') {
        document.getElementById('impersonate-someone').style.backgroundColor = 'rgb(0, 0, 0, 0.3)';
        impersonateSomeone = true;
    }
    else if (choice === 'posting-inappropriate-contents') {
        document.getElementById('posting-inappropriate-contents').style.backgroundColor = 'rgb(0, 0, 0, 0.3)';
        postingInappropriateContents = true;
    }
}

function reportAccount() {
    let content = '';
    if (impersonateSomeone === true)    content = 'Impersonate Someone';
    else if (postingInappropriateContents === true)    content = 'Posting inappropriate contents';

    let reportingUser = sessionStorage.getItem('username')
    let reportedUser = sessionStorage.getItem('viewUser');
    let data = JSON.stringify(
        {"reportAccount": "True", "reportedUser": reportedUser, "reportingUser": reportingUser, "content": content}
    );

    var req = new XMLHttpRequest();
    req.open("POST", "/templates/view-other-user-wall.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.reportAccount === true) {
            setTimeout(function() {
                alert("Your report was sent successfully!\nWe will review it soon.");
                location.reload();
            }, 300);
        }
    });
}