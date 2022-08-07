var countDisplayedComment = 0;
var like_array = [false, false, false];
var addedToMyFavorite = false;
var checkOpenSettingBox = false;
var containAds = false;
var hateSpeech = false;
var nudityImages = false;
var irrelevantContent = false;

function viewPost() {
    postID = sessionStorage.getItem("watchingPostID");
    watchingUser = sessionStorage.getItem("username");
    let data = JSON.stringify(
        {"viewDetailPost": "True", "postID": postID, "watchingUser": watchingUser}
    );
    var req = new XMLHttpRequest();
    req.open("POST", "/templates/detail-post.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.viewDetailPost == false) {
            alert("This post has been deleted!");
            history.back();
        }
        else if (received_data.viewDetailPost == true) {
            sessionStorage.setItem("postingUser", received_data.postingUser);
            document.getElementById("recipe-name").innerHTML = '<u><i>' + received_data.recipeName + '</i></u>';
            document.getElementById("posting-user-avatar-img").src = "data:image/png;base64," + received_data.avatar;
            document.getElementById("posting-user-avatar-img").style.borderRadius = "50%";
            document.getElementById("posting-user-fullname").innerHTML = received_data.fullname;
            document.getElementById("short-description-text").innerHTML = received_data.shortDescription;
            document.getElementById("thumbnail").src = "data:image/png;base64," + received_data.thumbnail;
            document.getElementById("thumbnail").style.width = "100%";
            document.getElementById("thumbnail").style.height = "400px";
            document.getElementById("preparation-time-button").value = received_data.preparationTime;
            document.getElementById("cooking-time-button").value = received_data.cookingTime;
            
            // Get ingredients
            HTMLingredient = '';
            for (var i = 0; i < received_data.ingredients.length; i++) {
                HTMLingredient += "<label id='ingredient" + String(i + 1) + "' class='ingredient'>- " + received_data.ingredients[i] + "</label><br><br>\n"
            }
            document.getElementById("indent-div-2").insertAdjacentHTML('beforebegin', HTMLingredient);
            
            // Get additional nutrition values
            HTMLnutrition= "<label id='calories' class='nutrition'>Calories:&nbsp<strong>" + received_data.calories + " kcal</strong></label><br>\n";
            for (var i = 0; i < received_data.additional_nutrition_values.length; i++) {
                HTMLnutrition += "<label id='nutrition" + String(i + 1) + "' class='nutrition'><i>- " + received_data.additional_nutrition_values[i] + "</i></label><br>\n"
            }
            document.getElementById("indent-div-6").insertAdjacentHTML('beforebegin', HTMLnutrition);

            // Get steps
            HTMLstep= '';
            for (var i = 0; i < received_data.steps.length; i++) {
                HTMLstep += "<label id='step" + String(i + 1) + "' class='step'>- " + received_data.steps[i] + "</label><br><br>\n"
            }
            document.getElementById("indent-div-4").insertAdjacentHTML('beforebegin', HTMLstep);
        
            // Get additional images
            HTMLadditionalimages= "";
            for (var i = 0; i < received_data.additional_images.length; i++) {
                HTMLadditionalimages += "<img id='additional-image-" + String(i + 1) + "' class='additional-image' src='" + "data:image/png;base64," + received_data.additional_images[i] + "'>\n"
            }
            document.getElementById("indent-div-8").insertAdjacentHTML('beforebegin', HTMLadditionalimages);
        
            // Get likes
            if (received_data.likes.length != 0) {
                for(var i = 0; i < received_data.likes.length; i++) {
                    if (received_data.likes[i][0] == 'LOVE') {
                        var str1 = document.getElementById("love-button").innerHTML;
                        document.getElementById("love-button").innerHTML = str1.slice(0, -1) + String(received_data.likes[i][1]);
                    }
                    else if (received_data.likes[i][0] == 'HAHA') {
                        var str2 = document.getElementById("haha-button").innerHTML;
                        document.getElementById("haha-button").innerHTML = str2.slice(0, -1) + String(received_data.likes[i][1]);
                    }
                    else if (received_data.likes[i][0] == 'ANGRY') {
                        var str3 = document.getElementById("angry-button").innerHTML;
                        document.getElementById("angry-button").innerHTML = str3.slice(0, -1) + String(received_data.likes[i][1]);
                    }
                }
            }

            // Get my like
            var my_like = received_data.type_of_my_like;
            if (my_like) {
                var likeID = my_like.toLowerCase() + '-button';
                document.getElementById(likeID).style.backgroundColor = 'rgb(255, 165, 0, 0.3)';
                document.getElementById(likeID).style.border = '2px solid rgb(255, 165, 0, 0.8)';
            }
            if (my_like === "LOVE") like_array[0] = true;
            else if (my_like === "HAHA") like_array[1] = true;
            else if (my_like === "ANGRY") like_array[2] = true;

            // Get comments
            if (received_data.comments.length != 0) {
                document.getElementById('alert-no-comments').style.display = "none";
                HTMLcomments = '';
                for (var i = 0; i < received_data.comments.length; i++) {
                    commentID = received_data.comments[i][0];
                    var str = 'comment-id-' + String(i + 1);
                    sessionStorage.setItem(str, commentID);
                    startUser = received_data.comments[i][1];
                    cmt_content = received_data.comments[i][2];
                    cmt_avatar = "data:image/png;base64," + received_data.comments[i][3];
                    HTMLcomments += `<div id="user-comment-${String(i+1)}" class="user-comment"><img onclick="viewUserWallByComment('${startUser}')" style="cursor:pointer;" src="${cmt_avatar}" id="avatar-user-comment-${String(i+1)}" class="avatar-user-comment"><div class="username-comment" onclick="viewUserWallByComment('${startUser}')" style="cursor:pointer;"><strong>${startUser}</strong></div><div class="comment"><label id="comment" class="comment">${cmt_content}</label></div></div>`;
                    countDisplayedComment += 1;
                }
                document.getElementById("indent-div-10").insertAdjacentHTML('beforebegin', HTMLcomments);
            }
            else {
                document.getElementById('alert-no-comments').style.display = "block";
            }

            // Get favorite
            if (received_data.checkAddedToFavorite === true) {
                addedToMyFavorite = true;
                document.getElementById('favorite-button').style.color = '#9F2B68';
            }
        }
    });
}

function checkGuestLikeAndComment() {
    if (username === "GUEST") {
        document.getElementById("love-button").disabled = true;
        document.getElementById("love-button").style.cursor = "no-drop";
        document.getElementById("haha-button").disabled = true;
        document.getElementById("haha-button").style.cursor = "no-drop";
        document.getElementById("angry-button").disabled = true;
        document.getElementById("angry-button").style.cursor = "no-drop";
        document.getElementById("comment-textarea").style.display = 'none';
        document.getElementById("comment-button").style.display = 'none';
    }
}

function addComment() {
    your_comment = document.getElementById('comment-textarea').value;
    if (your_comment === "") {
        alert("Your have not entered any comment!");
        return;
    }
    let data = JSON.stringify(
        {"addComment": "True", "postID": postID, "startUser": watchingUser, "content": your_comment}
    );

    var req = new XMLHttpRequest();
    req.open("POST", "/detail-post.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.addComment == true) {
            newCommentID = received_data.commentID;
            var str = 'comment-id-' + String(countDisplayedComment + 1);
            sessionStorage.setItem(str, newCommentID);
            if (document.getElementById('alert-no-comments').style.display != "none") {
                    document.getElementById('alert-no-comments').style.display = "none";
                }
            cmt_content = your_comment;
            cmt_avatar = "data:image/png;base64," + avatar;
            HTMLcomment =`'<div id="user-comment-${String(countDisplayedComment + 1)}" class="user-comment"><img onclick="viewUserWallByComment('${watchingUser}')" style="cursor:pointer;" src="${cmt_avatar}" id="avatar-user-comment-${String(countDisplayedComment + 1)}" class="avatar-user-comment"><div class="username-comment" onclick="viewUserWallByComment('${watchingUser}')" style="cursor:pointer;"><strong>${watchingUser}</strong></div><div class="comment"><label id="comment" class="comment">${cmt_content}</label></div></div>`;
            countDisplayedComment += 1;
            document.getElementById("indent-div-10").insertAdjacentHTML('beforebegin', HTMLcomment);
            document.getElementById('comment-textarea').value = "";
        }
        else if (received_data.addComment == false) {
            alert("Cannot comment because this post was deleted!");
            history.back();
        }
    });
}

function setLikeArrayToFalse() {
    return [false, false, false]
}

function insertLike(buttonID) {
    var value = document.getElementById(buttonID).innerHTML;
    var split_value = value.split(' ');
    var number_of_like = parseInt(split_value[split_value.length - 1]);
    var new_number_of_like = number_of_like + 1;
    var count = 1;
    var temp = new_number_of_like;
    while (temp > 1) {
        temp = temp / 10;
        count++;
    }
    document.getElementById(buttonID).innerHTML = value.slice(0, -count) + ' ' + String(new_number_of_like);
    document.getElementById(buttonID).style.backgroundColor = 'rgb(255, 165, 0, 0.3)';
    document.getElementById(buttonID).style.border = '2px solid rgb(255, 165, 0, 0.8)';
}
function deleteLike(buttonID) {
    document.getElementById(buttonID).style.border = '2px solid white';
    document.getElementById(buttonID).style.backgroundColor = 'rgb(0, 0, 0, 0.08)';

    var value = document.getElementById(buttonID).innerHTML;
    var split_value = value.split(' ');
    var number_of_like = parseInt(split_value[split_value.length - 1]);
    var new_number_of_like = number_of_like - 1;
    var count = 1;
    var temp = new_number_of_like;
    while (temp > 1) {
        temp = temp / 10;
        count++;
    }
    document.getElementById(buttonID).innerHTML = value.slice(0, -count) + ' ' + String(new_number_of_like);
}


function unlike(buttonID) {
    let data = JSON.stringify(
        {"unlike": "True", "postID": postID, "startUser": watchingUser}
    );
    var req = new XMLHttpRequest();
    req.open("POST", "/templates/detail-post.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.unlike == true) {
            deleteLike(buttonID);
        }
        else {
            alert("Cannot unlike because this post is deleted!");
            history.back();
        }
    });
}
function changeLike(beforeButtonID, buttonID) {
    type_of_my_like = buttonID.split('-')[0].toUpperCase();
    let data = JSON.stringify(
        {"changeLike": "True", "postID": postID, "startUser": watchingUser, "type_of_my_like": type_of_my_like}
    );
    var req = new XMLHttpRequest();
    req.open("POST", "/templates/detail-post.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.changeLike == true) {
            deleteLike(beforeButtonID);
            insertLike(buttonID);
        }
        else {
            alert("Cannot change like because this post is deleted!");
            history.back();
        }
    });
}


function like(buttonID) {
    // Add like
    if (like_array[0] === false && like_array[1] === false && like_array[2] === false) { 
        if (buttonID === 'love-button'){
            like_array[0] = true;
        }
        else if (buttonID === 'haha-button'){
            like_array[1] = true;
        }
        else if (buttonID === 'angry-button'){
            like_array[2] = true;
        }

        let data = JSON.stringify(
            {"addLike": "True", "postID": postID, "startUser": watchingUser, "type_of_my_like": buttonID.split('-')[0].toUpperCase()}
        );
        var req = new XMLHttpRequest();
        req.open("POST", "/templates/detail-post.html", true);
        req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        req.send(data);
    
        req.addEventListener('load', function(){
            received_data = JSON.parse(req.responseText);
            if (received_data.addLike == true) {
                insertLike(buttonID);
            }
            else {
                alert("Cannot like because this post is deleted!");
                history.back();
            }
        });
        return;
    }

    // Unlike
    if (like_array[0] === true && buttonID == "love-button") {
        like_array = setLikeArrayToFalse();
        unlike(buttonID);
        return;
    }
    else if (like_array[1] === true && buttonID == "haha-button") {
        like_array = setLikeArrayToFalse();
        unlike(buttonID);
        return;
    }
    else if (like_array[2] === true && buttonID == "angry-button") {
        like_array = setLikeArrayToFalse();
        unlike(buttonID);
        return;
    }

    // Change like
    if (like_array[0] === true && buttonID != "love-button"){
        if (buttonID == "haha-button") {
            like_array = [false, true, false];
        }
        else if (buttonID == "angry-button") {
            like_array = [false, false, true];
        }
        changeLike("love-button", buttonID);
        return;
    }
    else if (like_array[1] === true && buttonID != "haha-button"){
        if (buttonID == "love-button") {
            like_array = [true, false, false];
        }
        else if (buttonID == "angry-button") {
            like_array = [false, false, true];
        }
        changeLike("haha-button", buttonID);
        return;
    }
    else if (like_array[2] === true && buttonID != "angry-button"){
        if (buttonID == "love-button") {
            like_array = [true, false, false];
        }
        else if (buttonID == "haha-button") {
            like_array = [false, true, false];
        }
        changeLike("angry-button", buttonID);
        return;
    }
}

function addToFavorite(){
    if (addedToMyFavorite === false) {
        postID = sessionStorage.getItem("watchingPostID");
        watchingUser = sessionStorage.getItem("username");
        let data = JSON.stringify(
            {"addToFavorite": "True", "postID": postID, "watchingUser": watchingUser}
        );
        var req = new XMLHttpRequest();
        req.open("POST", "/templates/detail-post.html", true);
        req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        req.send(data);

        req.addEventListener('load', function(){
            received_data = JSON.parse(req.responseText);
            if (received_data.addToFavorite == true) {
                addedToMyFavorite = true;
                document.getElementById('favorite-button').style.color = '#9F2B68';
                alert("Added to Favorite list successfully");
            }
            else if (received_data.addToFavorite == false) {
                alert("Cannot add to your Favorite because this post was deleted!");
                history.back();
            }
        });
    }
    else if (addedToMyFavorite === true) {
        postID = sessionStorage.getItem("watchingPostID");
        watchingUser = sessionStorage.getItem("username");
        let data = JSON.stringify(
            {"removeFromFavorite": "True", "postID": postID, "watchingUser": watchingUser}
        );
        var req = new XMLHttpRequest();
        req.open("POST", "/templates/detail-post.html", true);
        req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
        req.send(data);

        req.addEventListener('load', function(){
            received_data = JSON.parse(req.responseText);
            if (received_data.removeFromFavorite == true) {
                addedToMyFavorite = false;
                document.getElementById('favorite-button').style.color = 'white';
                alert("Removed from Favorite list successfully");
            }
            else if (received_data.removeFromFavorite == false) {
                alert("This recipe has been removed from your Favorite because the post was deleted!");
                history.back();
            }
        });
    }
}

function displayReportOrDeletingButton() {
    postingUser = sessionStorage.getItem("postingUser");
    watchingUser = sessionStorage.getItem("username");
    if (postingUser === watchingUser) {
        if (checkOpenSettingBox === false) {
            document.getElementById('report-or-delete-post-button').innerHTML = "Delete post";
            document.getElementById('report-or-delete-post-button').style.display = 'block';
            checkOpenSettingBox = true;
        }
        else {
            document.getElementById('report-or-delete-post-button').innerHTML = "";
            document.getElementById('report-or-delete-post-button').style.display = 'none';
            checkOpenSettingBox = false;
        }
    }
    else {
        if (checkOpenSettingBox === false) {
            document.getElementById('report-or-delete-post-button').innerHTML = "Report post";
            document.getElementById('report-or-delete-post-button').style.display = 'block';
            checkOpenSettingBox = true;
        }
        else {
            document.getElementById('report-or-delete-post-button').innerHTML = "";
            document.getElementById('report-or-delete-post-button').style.display = 'none';
            checkOpenSettingBox = false;
        }
    }
}

function deleteOrReportPost() {
    let status =  document.getElementById('report-or-delete-post-button').innerHTML;
    if (status === "Delete post") {
        status = 'deletePost';
        if (confirm("Your post will be deleted. This action cannot be undone.\nAre you sure to continue?") === true)
        {
            deletePost();
        }
        else return;
    }
    else if (status === "Report post") {
        status = 'reportPost';
        displayPostReportPopup();
    }
    else return;
    
}
function deletePost() {
    postID = sessionStorage.getItem("watchingPostID");
    watchingUser = sessionStorage.getItem("username");
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
            document.getElementById("alert-delete-or-report-successfully").style.display = "block";
            document.getElementById("alert-delete-or-report-successfully").innerHTML = "Your post was deleted successfully";
            setTimeout(function() {
                history.back();
            }, 1000);
        }
    });
}

function chooseReportChoice(choice) {
    document.getElementById('contain-ads').style.backgroundColor = 'rgb(240, 240, 240)';
    document.getElementById('hate-speech').style.backgroundColor = 'rgb(240, 240, 240)';
    document.getElementById('nudity-images').style.backgroundColor = 'rgb(240, 240, 240)';
    document.getElementById('irrelevant-content').style.backgroundColor = 'rgb(240, 240, 240)';
    containAds = false;
    hateSpeech = false;
    nudityImages = false;
    irrelevantContent = false;

    if (choice === 'contain-ads') {
        document.getElementById('contain-ads').style.backgroundColor = 'rgb(0, 0, 0, 0.3)';
        containAds = true;
    }
    else if (choice === 'hate-speech') {
        document.getElementById('hate-speech').style.backgroundColor = 'rgb(0, 0, 0, 0.3)';
        hateSpeech = true;
    }
    else if (choice === 'nudity-images') {
        document.getElementById('nudity-images').style.backgroundColor = 'rgb(0, 0, 0, 0.3)';
        nudityImages = true;
    }
    else if (choice === 'irrelevant-content') {
        document.getElementById('irrelevant-content').style.backgroundColor = 'rgb(0, 0, 0, 0.3)';
        irrelevantContent = true;
    }
}

function displayPostReportPopup() {
    let height = document.getElementById('detail-recipe-form').offsetHeight + 70 + 'px';
    document.getElementById('report-post-popup-div').style.height = height;
    document.getElementById('report-post-popup-div').style.display = "block";
}

function reportPost() {
    let content = '';
    if (containAds === true)    content = 'Contain Ads';
    else if (hateSpeech === true)    content = 'Hate Speech';
    else if (nudityImages === true)    content = 'Nudity Images';
    else if (irrelevantContent === true)    content = 'Irrelevant Content';
    if (!containAds && !hateSpeech && !nudityImages && !irrelevantContent) {
        alert("Please choose your report reason!");
        return;
    }
    postID = sessionStorage.getItem("watchingPostID");
    watchingUser = sessionStorage.getItem("username");
    let data = JSON.stringify(
        {"reportPost": "True", "postID": postID, "reportingUser": watchingUser, "content": content}
    );
    var req = new XMLHttpRequest();
    req.open("POST", "/templates/detail-post.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.reportPost === true) {
            setTimeout(function() {
                alert("Your report was sent successfully!\nWe will review it soon.");
                location.reload();
            }, 300);
        }
        else if (received_data.reportPost === false) {
            alert("Cannot send report because this post was deleted!");
            history.back();
        }
    });
}

function viewUserWall() {
    let viewUser = sessionStorage.getItem("postingUser");
    sessionStorage.setItem("viewUser", viewUser);
    location.href = "/templates/view-other-user-wall.html";
}

function viewUserWallByComment(startUser) {
    sessionStorage.setItem("viewUser", startUser);
    location.href = "/templates/view-other-user-wall.html";
}