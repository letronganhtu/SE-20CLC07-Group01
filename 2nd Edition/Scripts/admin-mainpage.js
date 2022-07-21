var chooseReportedPosts = true;
var chooseReportedAccounts = false;

function readReportedPosts() {
    let data = JSON.stringify(
        {"readReportedPosts": "True"}
    );
    var req = new XMLHttpRequest();
    req.open("POST", "/templates/admin-mainpage.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.readReportedPosts == true) {
            reportedPosts = received_data.reportedPosts;
            if (reportedPosts.length === 0) {
                HTMLString = `<tr><th>ID Post reported</th><th>Reporter</th><th>Reason</th><th>Action</th></tr><tr id="no-reports"><td colspan="4" class="no-reports-title">No reports</td></tr>`;
                document.getElementById('reports-table').innerHTML = HTMLString;
                return;
            }
            HTMLString = `<tr><th>ID Post reported</th><th>Reporter</th><th>Reason</th><th>Action</th></tr>`;
                document.getElementById('reports-table').innerHTML = HTMLString;

            HTMLReportedPosts = document.getElementById('reports-table').innerHTML;
            for (let i = 0; i < reportedPosts.length; i++) {
                let htmlString = `<tr><td id="post-id-${String(i + 1)}"><a href="javascript:viewDetailPost('${reportedPosts[i][0]}', '${reportedPosts[i][1]}')">#${reportedPosts[i][1]}</a></td><td id="reporter-id-${String(i + 1)}">@${reportedPosts[i][2]}</td><td id="reason-${String(i + 1)}">${reportedPosts[i][3]}</td><td><button id="delete-post-button-${String(i + 1)}" class="delete-post-button" onclick=deleteViolatedPost('${String(reportedPosts[i][1])}')>Delete post</button><button id="ignore-button-${String(i + 1)}" class="ignore-button" onclick=ignoreDeletingPost('${reportedPosts[i][0]}','${reportedPosts[i][1]}')>Ignore</button></td></tr>`;
                HTMLReportedPosts += htmlString;
            }
            document.getElementById('reports-table').innerHTML = HTMLReportedPosts;
        }
    });
}

function viewDetailPost(reportID, postID) {
    sessionStorage.setItem("reportID", reportID);
    sessionStorage.setItem("watchingPostID", postID);
    location.href = '/templates/admin-view-post.html';
}

function deleteViolatedPost(postID) {
    alert(postID);
}

function ignoreDeletingPost(reportID, postID) {

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
            readReportedPosts();
        }
    });
}