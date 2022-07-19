var countDisplayedNewestDishes = 4;

function readNewestPosts(num) {
    let data = JSON.stringify(
        {"readNewestDishes": "True", "row": num}
    );
    var req = new XMLHttpRequest();
    req.open("POST", "/templates.signup.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.readNewestDishes == true) {
            posts = received_data.posts;
            for (var i = 0; i < received_data.posts.length; i++) {
                var newestDishes = 'newestDishes' + String(i);
                sessionStorage.setItem(newestDishes, posts[i][0]);

                var idAvatar = "post-avatar-icon-" + String(i + 1);
                var avatar = "data:image/png;base64," + posts[i][1];
                document.getElementById(idAvatar).src = avatar;

                var idUser = "post-username-" + String(i + 1);
                document.getElementById(idUser).innerHTML = posts[i][2];
                
                var recipeName = 'recipe-name-' + String(i + 1);
                document.getElementById(recipeName).innerHTML = "<i>" + posts[i][3] + "</i>";
                
                var idThumbnail = "post-image-" + String(i + 1);
                var thumbnail = "data:image/png;base64," + posts[i][4];
                document.getElementById(idThumbnail).src = thumbnail;
            }
        }
    });
}

function seeMoreNewestDishes(num) {
    var HTMLgallery = "";
    countDisplayedNewestDishes += 4;
    for (var i = countDisplayedNewestDishes - 4; i < countDisplayedNewestDishes; i++) {
        HTMLgallery += '<div class="gallery"><img id="post-image-' + String(i+1) +'" src="https://previews.123rf.com/images/lkeskinen/lkeskinen1610/lkeskinen161000246/63375277-no-information-rubber-stamp-on-white-print-impress-overprint-.jpg" class="post-image"><small id="recipe-name-' + String(i + 1) +'" class="recipe-name"><i>XXXXXXXX</i></small><div class="postingUser"><div id="post-avatar-icon-div-' + String(i+1) + '" class="post-avatar-icon-div"><img src="" id="post-avatar-icon-' + String(i+1) + '" class="post-avatar-icon"></div><div id="post-username-' + String(i+1) + '" class="post-username">XXXXXXXX</div></div><button id="view-post-button-' + String(i+1) + '" class="view-post-button" onclick="viewDetailPost(this.id)">View</button></div>\n';
    }
    document.getElementById('see-more-button').insertAdjacentHTML('beforebegin', HTMLgallery);
    readNewestPosts(countDisplayedNewestDishes);
}

function viewDetailPost(id) {
    pos = id.substr(id.length - 1);
    pos--;
    var postID = "newestDishes" + String(pos);
    clickedDish = sessionStorage.getItem(postID);
    if (clickedDish === null) {
        alert("No post was uploaded!");
        return;
    }
    sessionStorage.setItem("watchingPostID", clickedDish);
    location.href = '/templates/detail-post.html';
}

