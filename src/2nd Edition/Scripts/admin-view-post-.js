var countDisplayedComment = 0;
var postID = sessionStorage.getItem('watchingPostID');
var reportID = sessionStorage.getItem('reportID');

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
        if (received_data.viewDetailPost == true) {
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
                    HTMLcomments += '<div id="user-comment-' + String(i + 1) + '" class="user-comment"><img src="' + cmt_avatar + '" id="avatar-user-comment-' + String(i + 1) + '" class="avatar-user-comment"><div class="username-comment"><strong>' + startUser + '</strong></div><div class="comment"><label id="comment" class="comment">' + cmt_content + '</label></div></div>';
                    countDisplayedComment += 1;
                }
                document.getElementById("indent-div-10").insertAdjacentHTML('beforebegin', HTMLcomments);
            }
            else {
                document.getElementById('alert-no-comments').style.display = "block";
            }
        }
    });
}

function deleteViolatedPost() {
    alert(postID);
}

function ignoreDeletingPost() {
    let data = JSON.stringify(
        {"ignoreDeletingPost": "True", "reportID": reportID, "postID": postID}
    );
    var req = new XMLHttpRequest();
    req.open("POST", "/templates/admin-mainpage.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.ignoreDeletingPost == true) {
            location.href = '/templates/admin-mainpage.html';
        }
    });
}
