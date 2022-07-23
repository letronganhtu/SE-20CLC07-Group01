var countNewestDishesDiv = 4;
var totalPosts = 0;

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
                if (i >= posts.length) {
                    document.getElementById("see-more-button").style.display = 'none';
                    break;
                }
                var newestDishes = 'newestDishes' + String(i);
                sessionStorage.setItem(newestDishes, posts[i][0]);

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
            }
        }
    });
}

function seeMoreNewestDishes() {
    var HTMLgallery = "";
    countNewestDishesDiv += 4;
    for (var i = countNewestDishesDiv - 4; i < countNewestDishesDiv; i++) {
        HTMLgallery += `<div class="gallery"><a id="view-post-${String(i+1)}" href="javascript:viewDetailPost('view-post-${String(i + 1)}')"><img id="post-image-${String(i+1)}" src="https://previews.123rf.com/images/lkeskinen/lkeskinen1610/lkeskinen161000246/63375277-no-information-rubber-stamp-on-white-print-impress-overprint-.jpg" class="post-image"></a><small id="recipe-name-${String(i + 1)}" class="recipe-name">XXXXXXXX</small><div class="postingUser"><div id="post-avatar-icon-div-${String(i+1)}" class="post-avatar-icon-div"><img src="" id="post-avatar-icon-${String(i+1)}" class="post-avatar-icon"></div><div id="post-username-${String(i + 1)}" class="post-username">XXXXXXXX</div></div></div>\n`;
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
