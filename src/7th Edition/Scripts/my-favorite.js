function viewProfile() {
    let username = sessionStorage.getItem('username');

    let data = JSON.stringify(
        {"viewProfile": "True", "username": username}
    );
    var req = new XMLHttpRequest();
    req.open("POST", "/templates/my-favorite.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.viewProfile == true) {
            avatar = received_data.avatar;
            fullname = received_data.fullname;
            username = received_data.username;
            available = received_data.available;
            sessionStorage.setItem('available', available);
            document.getElementById('in-page-avatar').src = "data:image/png;base64," + avatar;
            document.getElementById('fullname').innerHTML = fullname;
            document.getElementById('username').innerHTML = '@' + username;
        }
    });
}

function getFavoriteRecipes() {
    username = sessionStorage.getItem('username');

    let data = JSON.stringify(
        {"getFavoriteRecipes": "True", "username": username}
    );
    var req = new XMLHttpRequest();
    req.open("POST", "/templates/my-favorite.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.getFavoriteRecipes == true) {
            posts = received_data.posts;
            if (posts.length === 0) {
                document.getElementById('no-recipes-div').style.display = 'block';
            }
            else {
                document.getElementById('no-recipes-div').style.display = 'none';
                HTMLpost = '';
                for(let i = 0; i < posts.length; i++) {
                    //[postID, postingUser, fullname, avatar, recipeName, calories, thumbnail]
                    postID = String(posts[i][0]);
                    postingUser = posts[i][1];
                    fullname = posts[i][2];
                    avatar = "data:image/png;base64," + posts[i][3];
                    recipeName = posts[i][4];
                    calories = String(posts[i][5])
                    thumbnail = "data:image/png;base64," + posts[i][6];
                    HTMLpost += `<a href="javascript:viewDetailPost('recipe-${String(i + 1)}')"><div id="recipe-${String(i + 1)}" class="recipe">
                                    <div class="recipe-avatar-div">
                                        <img id="recipe-avatar-${String(i + 1)}" class="recipe-avatar" src="${avatar}">
                                    </div>
                                    <div class="recipe-fullname-div">
                                        <span id="recipe-fullname-${String(i + 1)}" class="recipe-fullname">${fullname}</span>
                                    </div>
                                    <div class="recipe-username-div">
                                        <span id="recipe-username-${String(i + 1)}" class="recipe-username">@${postingUser}</span>
                                    </div>
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
                    let id = `recipe-${String(i + 1)}`;
                    sessionStorage.setItem(id, postID);
                }
                document.getElementById('favorite-recipes-div').innerHTML += HTMLpost;
            }
        }
    });
}

function viewDetailPost(id) {
    pos = id.split('-');
    pos = pos[1];
    var savedRecipeID = "recipe-" + String(pos);
    postID = sessionStorage.getItem(savedRecipeID);
    if (postID === null) {
        alert("No post was uploaded!");
        return;
    }
    sessionStorage.setItem("watchingPostID", postID);
    location.href = '/templates/detail-post.html';
}