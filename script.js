// Corrected Google Apps Script Web App URL (closed the missing quote)
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwEGj58P9NeIUeW3wxSa9E607BwL42HxKnIKRjI4ndxsR2Mxwd1cXozWn3EG1PVeD5fbg/exec";

document.getElementById('checkinForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const btn = document.getElementById('submitBtn');
    const responseBox = document.getElementById('response-box');
    const historyList = document.getElementById('history-list');

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const pin = document.getElementById('pin') ? document.getElementById('pin').value.trim() : "";
    const message = document.getElementById('message').value.trim();

    btn.textContent = "そうしんちゅう... (Sending...)";
    btn.disabled = true;
    responseBox.style.display = "none";
    responseBox.style.background = "#eff6ff";
    responseBox.style.borderColor = "#bfdbfe";
    responseBox.style.color = "#1e40af";
    if (historyList) historyList.innerHTML = "";

    const formData = new URLSearchParams();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("pin", pin);
    formData.append("message", message);

    fetch(WEB_APP_URL, {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            responseBox.style.display = "block";
            responseBox.innerHTML = "<strong>うけつけました！(Check-in Recorded)</strong>";
            document.getElementById('message').value = "";

            if (Array.isArray(data.history)) {
                renderHistory(data.history);
            }
        } else {
            throw new Error(data.message || "Unknown error");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        responseBox.style.display = "block";
        responseBox.style.background = "#fee2e2";
        responseBox.style.borderColor = "#fca5a5";
        responseBox.style.color = "#991b1b";
        responseBox.innerHTML = "<strong>エラー (Error!)</strong> Could not connect to the server. Please try again.";
    })
    .finally(() => {
        btn.textContent = "そうしん (Submit Check-in)";
        btn.disabled = false;
    });
});

function renderHistory(items) {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = "";

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = item.pending ? "history-card pending" : "history-card";

        const badge = item.pending
            ? "<span class='badge-pending'>へんじまち (Pending Reply)</span>"
            : "";

        const replyHtml = item.pending
            ? "<div class='history-waiting'>せんせいがかくにん中です。(Awaiting instructor replyval...)</div>"
            : "<div class='history-reply'><strong>先生:</strong> " + escapeText(item.reply) + "</div>";

        card.innerHTML =
            "<div class='history-date'>" + escapeText(item.date) + badge + "</div>" +
            "<div class='history-student'>" + escapeText(item.message) + "</div>" +
            replyHtml;

        historyList.appendChild(card);
    });
}

function escapeText(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
}
