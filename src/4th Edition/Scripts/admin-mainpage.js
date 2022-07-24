var chooseReportedPosts = true;
var chooseReportedAccounts = false;

function readReportedPosts() {
    document.getElementById('reported-accounts-button').style.backgroundColor = 'rgb(0, 0, 0, 0.1)';
    document.getElementById('reported-posts-button').style.backgroundColor = 'rgb(0, 0, 0, 0.3)';
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
                HTMLString = `<tr><th>Reported Post ID</th><th>Reporter</th><th>Reason</th><th>Action</th></tr><tr id="no-reports"><td colspan="4" class="no-reports-title">No reports</td></tr>`;
                document.getElementById('reports-table').innerHTML = HTMLString;
                return;
            }
            HTMLString = `<tr><th>Reported Post ID</th><th>Reporter</th><th>Reason</th><th>Action</th></tr>`;
                document.getElementById('reports-table').innerHTML = HTMLString;

            HTMLReportedPosts = document.getElementById('reports-table').innerHTML;
            for (let i = 0; i < reportedPosts.length; i++) {
                let htmlString = `<tr><td id="post-id-${String(i + 1)}"><a href="javascript:viewDetailPost('${reportedPosts[i][0]}','${reportedPosts[i][1]}','${reportedPosts[i][2]}','${reportedPosts[i][3]}')">#${reportedPosts[i][1]}</a></td><td id="reporter-id-${String(i + 1)}">@${reportedPosts[i][2]}</td><td id="reason-${String(i + 1)}">${reportedPosts[i][3]}</td><td><button id="delete-post-button-${String(i + 1)}" class="delete-post-button" onclick=deleteViolatedPost('${String(reportedPosts[i][0])}','${String(reportedPosts[i][1])}')>Delete post</button><button id="ignore-post-button-${String(i + 1)}" class="ignore-post-button" onclick=ignoreDeletingPost('${reportedPosts[i][0]}','${reportedPosts[i][1]}')>Ignore</button></td></tr>`;
                HTMLReportedPosts += htmlString;
            }
            document.getElementById('reports-table').innerHTML = HTMLReportedPosts;
        }
    });
}

function viewDetailPost(reportID, postID, reportingUser, reasonText) {
    sessionStorage.setItem("reportID", reportID);
    sessionStorage.setItem("watchingPostID", postID);
    sessionStorage.setItem('reportingUser', reportingUser);
    sessionStorage.setItem('reasonText', reasonText);
    location.href = '/templates/admin-view-post.html';
}

function deleteViolatedPost(reportID, postID) {
    let data = JSON.stringify(
        {"deleteViolatedPost": "True", "reportID": reportID, "postID": postID}
    );
    var req = new XMLHttpRequest();
    req.open("POST", "/templates/admin-mainpage.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.deleteViolatedPost == true) {
            readReportedPosts();
        }
    });
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


function readReportedAccounts() {
    document.getElementById('reported-posts-button').style.backgroundColor = 'rgb(0, 0, 0, 0.1)';
    document.getElementById('reported-accounts-button').style.backgroundColor = 'rgb(0, 0, 0, 0.3)';
    let data = JSON.stringify(
        {"readReportedAccounts": "True"}
    );
    var req = new XMLHttpRequest();
    req.open("POST", "/templates/admin-mainpage.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.readReportedAccounts == true) {
            reportedAccounts = received_data.reportedAccounts;
            if (reportedAccounts.length === 0) {
                HTMLString = `<tr><th>Reported Account ID</th><th>Reporter</th><th>Reason</th><th>Action</th></tr><tr id="no-reports"><td colspan="4" class="no-reports-title">No reports</td></tr>`;
                document.getElementById('reports-table').innerHTML = HTMLString;
                return;
            }
            HTMLString = `<tr><th>Reported Account ID</th><th>Reporter</th><th>Reason</th><th>Action</th></tr>`;
                document.getElementById('reports-table').innerHTML = HTMLString;

            HTMLReportedAccounts = document.getElementById('reports-table').innerHTML;
            for (let i = 0; i < reportedAccounts.length; i++) {
                let htmlString = `<tr><td id="reported-id-${String(i + 1)}"><a href="javascript:viewDetailAccount('${reportedAccounts[i][0]}','${reportedAccounts[i][1]}','${reportedAccounts[i][2]}','${reportedAccounts[i][3]}')">@${reportedAccounts[i][1]}</a></td><td id="reporter-id-${String(i + 1)}">@${reportedAccounts[i][2]}</td><td id="reason-${String(i + 1)}">${reportedAccounts[i][3]}</td><td><button id="delete-account-button-${String(i + 1)}" class="delete-account-button" onclick=suspendViolatedAccount('${String(reportedAccounts[i][0])}','${String(reportedAccounts[i][1])}')>Suspend Account</button><button id="ignore-account-button-${String(i + 1)}" class="ignore-account-button" onclick=ignoreSuspendingAccount('${reportedAccounts[i][0]}','${reportedAccounts[i][1]}')>Ignore</button></td></tr>`;
                HTMLReportedAccounts += htmlString;
            }
            document.getElementById('reports-table').innerHTML = HTMLReportedAccounts;
        }
    });
}

function viewDetailAccount(reportID, reportedUser, reportingUser, reasonText) {
    sessionStorage.setItem("reportID", reportID);
    sessionStorage.setItem("reportedUser", reportedUser);
    sessionStorage.setItem('reportingUser', reportingUser);
    sessionStorage.setItem('reasonText', reasonText);
    location.href = '/templates/admin-view-account.html';
}

function suspendViolatedAccount(reportID, reportedUser) {
    let data = JSON.stringify(
        {"suspendViolatedAccount": "True", "reportID": reportID, "reportedUser": reportedUser}
    );
    var req = new XMLHttpRequest();
    req.open("POST", "/templates/admin-mainpage.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.suspendViolatedAccount == true) {
            readReportedAccounts();
        }
    });
}

function ignoreSuspendingAccount(reportID, reportedUser) {
    let data = JSON.stringify(
        {"ignoreSuspendingAccount": "True", "reportID": reportID, "reportedUser": reportedUser}
    );
    var req = new XMLHttpRequest();
    req.open("POST", "/templates/admin-mainpage.html", true);
    req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    req.send(data);

    req.addEventListener('load', function(){
        received_data = JSON.parse(req.responseText);
        if (received_data.ignoreSuspendingAccount == true) {
            readReportedAccounts();
        }
    });
}