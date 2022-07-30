function viewProfile() {
    let username = sessionStorage.getItem('username');

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

function getMyRecipes() {
    username = sessionStorage.getItem('username');

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
                    
                    HTMLpost += `<a id='link-${String(i + 1)}' href="javascript:viewDetailPost('recipe-${String(i + 1)}')"><div id="recipe-${String(i + 1)}" class="recipe">
                                    <div class="recipe-name-div">
                                        <span id="recipe-name-${String(i + 1)}" class="recipe-name">${recipeName}</span>
                                    </div>
                                    <div class="calories-div">
                                        <span id="calories-${String(i + 1)}" class="calories"><i class="fa fa-fire"></i>&nbsp${calories} kcal</span>
                                        <button id="delete-post-${String(i + 1)}" class="delete-post-button" onclick="deletePost(this.id)"><i class='fa fa-trash'></i>&nbspDelete</button>
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
    let savedRecipeID = "my-recipe-" + String(pos);
    postID = sessionStorage.getItem(savedRecipeID);
    if (postID === null) {
        alert("No post was uploaded!");
        return;
    }
    sessionStorage.setItem("watchingPostID", postID);
    location.href = '/templates/detail-post.html';
}

function deletePost(id) {
    if (confirm("Your post will be deleted. This action cannot be undone.\nAre you sure to continue?") === false)
        return;
    pos = id.split('-');
    pos = pos[pos.length - 1];
    document.getElementById(`link-${pos}`).href = '#';
    let savedRecipeID = "my-recipe-" + String(pos);
    postID = sessionStorage.getItem(savedRecipeID);
    let data = JSON.stringify(
        {"deletePost": "True", "postID": postID}
    );
    var req = new XMLHttpRequest();
    req.open("POST", "/templates/detail-post.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.deletePost === true) {
            setTimeout(function() {
                location.reload();
            }, 1000);
        }
    });
}