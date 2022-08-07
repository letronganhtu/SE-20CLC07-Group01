var countNewestDishesDiv = 4;
var totalPosts = 0;
var countTotalTrendingPosts = 0;

function readNewestPosts(num) {
    let data = JSON.stringify(
        {"readNewestDishes": "True", "row": num}
    );
    var req = new XMLHttpRequest();
    req.open("POST", "/templates/mainpage.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.readNewestDishes == true) {
            posts = received_data.posts;
            for (var i = 0; i < countNewestDishesDiv; i++) {
                var newestDishes = 'newestDishes' + String(i);
                sessionStorage.setItem(newestDishes, posts[i][0]);

                let postingUser = 'postingUser-' + String(i + 1);
                sessionStorage.setItem(postingUser, posts[i][2]);

                var idAvatar = "post-avatar-icon-" + String(i + 1);
                var avatarString = "data:image/png;base64," + posts[i][1];
                document.getElementById(idAvatar).src = avatarString;

                var idUser = "post-username-" + String(i + 1);
                document.getElementById(idUser).innerHTML = posts[i][2];
                
                var recipeName = 'recipe-name-' + String(i + 1);
                document.getElementById(recipeName).innerHTML = "<i>" + posts[i][3] + "</i>";
                
                var idThumbnail = "post-image-" + String(i + 1);
                var thumbnail = "data:image/png;base64," + posts[i][4];
                document.getElementById(idThumbnail).src = thumbnail;
                if (i >= posts.length - 1) {
                    document.getElementById("see-more-button").style.visibility = "hidden";
                    break;
                }
            }
            for (var i = 0; i < countNewestDishesDiv; i++) {
                let idThumbnail = "post-image-" + String(i + 1);
                if (document.getElementById(idThumbnail).src === "https://previews.123rf.com/images/lkeskinen/lkeskinen1610/lkeskinen161000246/63375277-no-information-rubber-stamp-on-white-print-impress-overprint-.jpg"){
                    let galleryID = 'gallery-' + String(i+1);
                    document.getElementById(galleryID).style.display = 'none';
                }

            }
        }
    });
}

function seeMoreNewestDishes() {
    var HTMLgallery = "";
    countNewestDishesDiv += 4;
    for (var i = countNewestDishesDiv - 4; i < countNewestDishesDiv; i++) {
        HTMLgallery += `<div id="gallery-${String(i+1)}" class="gallery"><a id="view-post-${String(i+1)}" href="javascript:viewDetailPost('view-post-${String(i + 1)}')"><img id="post-image-${String(i+1)}" src="https://previews.123rf.com/images/lkeskinen/lkeskinen1610/lkeskinen161000246/63375277-no-information-rubber-stamp-on-white-print-impress-overprint-.jpg" class="post-image"></a><small id="recipe-name-${String(i + 1)}" class="recipe-name">XXXXXXXX</small><div class="postingUser"><div id="post-avatar-icon-div-${String(i+1)}" class="post-avatar-icon-div"><img src="" id="post-avatar-icon-${String(i+1)}" class="post-avatar-icon" onclick="viewUserWall(this.id)"></div><div id="post-username-${String(i + 1)}" class="post-username" onclick="viewUserWall(this.id)">XXXXXXXX</div></div></div>\n`;
    }
    document.getElementById('see-more-button').insertAdjacentHTML('beforebegin', HTMLgallery);
    readNewestPosts(countNewestDishesDiv);
}

function viewDetailPost(id) {
    pos = String(id).split('-');
    pos = pos[2];
    pos = parseInt(pos) - 1;
    var postID = "newestDishes" + String(pos);
    clickedDish = sessionStorage.getItem(postID);
    if (clickedDish === null) {
        alert("No post was uploaded!");
        return;
    }
    sessionStorage.setItem("watchingPostID", clickedDish);
    location.href = '/templates/detail-post.html';
}

function search() {
    var input = document.getElementById("search-bar").value;
    var regexCharacter = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;
    if (input === "" || input.match(regexCharacter)) {
        alert("Invalid input to search");
        return;
    } 
    let data = JSON.stringify(
        {"search": "True", 'input': input}
    );
    sessionStorage.setItem("searchData", data);
    sessionStorage.setItem('input', input);
    location.href = '/templates/search.html';
}

function viewUserWall(id) {
    id = id.split('-');
    pos = id[id.length - 1];
    let viewUser = sessionStorage.getItem(`postingUser-${pos}`);
    sessionStorage.setItem("viewUser", viewUser);
    location.href = "/templates/view-other-user-wall.html";
}

function readTrendingNowPosts() {
    let data = JSON.stringify(
        {"readTrendingNowPosts": "True"}
    );
    var req = new XMLHttpRequest();
    req.open("POST", "/templates/mainpage.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.readTrendingNowPosts == true) {
            posts = received_data.posts;
            const maxTrendingPosts = posts.length;
            // postID, amount_of_like, love, haha, postingUser, recipeName, avatar, thumbnail
            for (var i = 0; i < maxTrendingPosts; i++) {
                let trendingNowDish = 'trendingNowDish-' + String(i + 1);
                sessionStorage.setItem(trendingNowDish, posts[i][0]);

                let likeID = 'like-trending-now-' + String(i + 1);
                document.getElementById(likeID).innerHTML = `${posts[i][2]} <i class="fa fa-heart" style="color:red;"></i>&nbsp&nbsp${posts[i][3]} <img src="https://cdn.worldvectorlogo.com/logos/facebook-haha.svg" style="width:15px; height:12px;">`;

                let postingUser = 'postingUser-trending-now-' + String(i + 1);
                sessionStorage.setItem(postingUser, posts[i][4]);

                let idUser = "post-username-trending-now-" + String(i + 1);
                document.getElementById(idUser).innerHTML = posts[i][4];
                
                let recipeName = 'recipe-name-trending-now-' + String(i + 1);
                document.getElementById(recipeName).innerHTML = "<i>" + posts[i][5] + "</i>";

                let idAvatar = "post-avatar-icon-trending-now-" + String(i + 1);
                let avatarString = "data:image/png;base64," + posts[i][6];
                document.getElementById(idAvatar).src = avatarString;
                
                let idThumbnail = "post-image-trending-now-" + String(i + 1);
                let thumbnail = "data:image/png;base64," + posts[i][7];
                document.getElementById(idThumbnail).src = thumbnail;

                countTotalTrendingPosts+= 1;
            }

            for (var i = maxTrendingPosts; i < 4; i++) {
                let idThumbnail = "post-image-trending-now-" + String(i + 1);
                let galleryID = 'gallery-trending-now-' + String(i+1);
                document.getElementById(galleryID).style.display = 'none';
            }
        }
    });
}

function viewDetailPostTrendingNow(id) {
    id = id.split('-');
    pos = id[id.length - 1];
    var postID = "trendingNowDish-" + String(pos);
    clickedDish = sessionStorage.getItem(postID);
    if (clickedDish === null) {
        alert("No post was uploaded!");
        return;
    }
    sessionStorage.setItem("watchingPostID", clickedDish);
    location.href = '/templates/detail-post.html';
}