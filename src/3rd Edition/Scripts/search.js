var countDisplayedPost = 0;
var index = 8;
var maxPost = index;

function showSearchResults() {
    data = sessionStorage.getItem('searchData');

    var req = new XMLHttpRequest();
    req.open("POST", "/templates/search.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.search == true) {
            posts = received_data.posts;
            let inputData = sessionStorage.getItem("input");
            document.getElementById("input-data").innerHTML = '<strong>' + inputData + '</strong>';
            if (posts.length === 0 || posts.length === 1)
                document.getElementById("number-of-post").innerHTML = '(' + String(posts.length) + ' result)' ;
            else
                document.getElementById("number-of-post").innerHTML = '(' + String(posts.length) + ' results)' ;

            if (posts.length > 0) {
                document.getElementById("no-result-div").style.display = "none";

                HTMLgallery = '';
                for (var i = 0; i < posts.length; i++) {
                    if (i % maxPost === 0 && i != 0) {
                        break;
                    }
                    HTMLgallery += '<div class="gallery"><div id="calo-div"><i class="fa fa-fire"></i><label id="calo-' + String(i + 1) + '"> XXXXXXXX kcal</label></div><a id="view-post-' + String(i + 1) + '" href="javascript:viewDetailPost(\'view-post-' + String(i + 1) + '\')"><img id="post-image-' + String(i+1) +'" src="https://previews.123rf.com/images/lkeskinen/lkeskinen1610/lkeskinen161000246/63375277-no-information-rubber-stamp-on-white-print-impress-overprint-.jpg" class="post-image"></a><small id="recipe-name-' + String(i + 1) +'" class="recipe-name">XXXXXXXX</small><div class="postingUser"><div id="post-avatar-icon-div-' + String(i+1) + '" class="post-avatar-icon-div"><img src="" id="post-avatar-icon-' + String(i+1) + '" class="post-avatar-icon" onclick="viewUserWall(this.id)"></div><div id="post-username-' + String(i+1) + '" class="post-username" onclick="viewUserWall(this.id)">XXXXXXXX</div></div></div>\n';
                    countDisplayedPost += 1;
                }
                document.getElementById('recipes-div').innerHTML +=  HTMLgallery;

                for (var i = 0; i < posts.length; i++) {
                    if (i % maxPost === 0 && i != 0) {
                        document.getElementById('recipes-div').innerHTML += '<button id="see-more-button" class="see-more-button" onclick="seeMoreResults(posts)">See more results...</button>';
                        break;
                    }
                    var searchedResultPostID = 'searchedResultPostID-' + String(i);
                    sessionStorage.setItem(searchedResultPostID, posts[i][0]);

                    sessionStorage.setItem(`postingUser-${String(i + 1)}`, posts[i][1]);
                    
                    let idAvatar = "post-avatar-icon-" + String(i + 1);
                    let avatarString = "data:image/png;base64," + posts[i][2];
                    document.getElementById(idAvatar).src = avatarString;

                    let idUser = "post-username-" + String(i + 1);
                    document.getElementById(idUser).innerHTML = posts[i][1];
                    
                    let recipeName = 'recipe-name-' + String(i + 1);
                    document.getElementById(recipeName).innerHTML = "<i>" + posts[i][3] + "</i>";
                    
                    let idThumbnail = "post-image-" + String(i + 1);
                    let thumbnail = "data:image/png;base64," + posts[i][4];
                    document.getElementById(idThumbnail).src = thumbnail;

                    let calories = String(posts[i][5]);
                    let idCalories = 'calo-' + String(i + 1);
                    document.getElementById(idCalories).innerHTML = ' <strong>'+ calories + ' kcal</strong>';
                }
            }
        }
    });
}

function viewDetailPost(id) {
    pos = String(id).split('-');
    pos = pos[2];
    pos = parseInt(pos) - 1;
    var postID = sessionStorage.getItem(`searchedResultPostID-${pos}`);
    if (postID === null) {
        alert("No post was uploaded!");
        return;
    }
    sessionStorage.setItem("watchingPostID", postID);
    location.href = '/templates/detail-post.html';
}

function seeMoreResults(){
    var temp_num = maxPost;
    maxPost += index;
    HTMLgallery = '';
    for (var i = temp_num; i < posts.length; i++) {
        if (i % maxPost === 0 && i != 0) {
            break;
        }
        HTMLgallery += '<div class="gallery"><div id="calo-div"><i class="fa fa-fire"></i><label id="calo-' + String(i + 1) + '"> XXXXXXXX kcal</label></div><img id="post-image-' + String(i+1) +'" src="https://previews.123rf.com/images/lkeskinen/lkeskinen1610/lkeskinen161000246/63375277-no-information-rubber-stamp-on-white-print-impress-overprint-.jpg" class="post-image"><small id="recipe-name-' + String(i + 1) +'" class="recipe-name"><i>XXXXXXXX</i></small><div class="postingUser"><div id="post-avatar-icon-div-' + String(i+1) + '" class="post-avatar-icon-div"><img src="" id="post-avatar-icon-' + String(i+1) + '" class="post-avatar-icon"></div><div id="post-username-' + String(i+1) + '" class="post-username">XXXXXXXX</div></div><button id="view-post-button-' + String(i+1) + '" class="view-post-button" onclick="viewDetailPost(this.id)">View</button></div>\n';
        countDisplayedPost += 1;
    }
    document.getElementById('see-more-button').insertAdjacentHTML('beforebegin', HTMLgallery);

    for (var i = temp_num; i < posts.length; i++) {
        if (i % maxPost === 0 && i != 0) {
            break;
        }
        var searchedResultPostID = 'searchedResultPostID' + String(i);
        sessionStorage.setItem(searchedResultPostID, posts[i][0]);
        
        let idAvatar = "post-avatar-icon-" + String(i + 1);
        let avatarString = "data:image/png;base64," + posts[i][2];
        document.getElementById(idAvatar).src = avatarString;

        let idUser = "post-username-" + String(i + 1);
        document.getElementById(idUser).innerHTML = posts[i][1];
        
        let recipeName = 'recipe-name-' + String(i + 1);
        document.getElementById(recipeName).innerHTML = "<i>" + posts[i][3] + "</i>";
        
        let idThumbnail = "post-image-" + String(i + 1);
        let thumbnail = "data:image/png;base64," + posts[i][4];
        document.getElementById(idThumbnail).src = thumbnail;

        let calories = String(posts[i][5]);
        let idCalories = 'calo-' + String(i + 1);
        document.getElementById(idCalories).innerHTML = ' <strong>'+ calories + ' kcal</strong>';
    }
    if (countDisplayedPost === posts.length) {
        document.getElementById('see-more-button').style.display = 'none';
    }
}

function showSortFilter() {
    if (document.getElementById("sort-features-div").style.display === "none") {
        document.getElementById("sort-features-div").style.display = "block";
    }
    else {
        document.getElementById("sort-features-div").style.display = "none";
    }
    return;
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