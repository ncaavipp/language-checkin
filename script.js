// Corrected Google Apps Script Web App URL (closed the missing quote)
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwEGj58P9NeIUeW3wxSa9E607BwL42HxKnIKRjI4ndxsR2Mxwd1cXozWn3EG1PVeD5fbg/exec";

document.getElementById('checkinForm').addEventListener('submit', function(e) {
    // Prevent the default browser form submission / page reload
    e.preventDefault();

    const btn = document.getElementById('submitBtn');
    const responseBox = document.getElementById('response-box');

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const pin = document.getElementById('pin') ? document.getElementById('pin').value.trim() : "";
    const message = document.getElementById('message').value.trim();

    // UI state: Loading
    btn.textContent = "そうしんちゅう... (Sending...)";
    btn.disabled = true;
    responseBox.style.display = "none";
    responseBox.style.background = "#eff6ff";
    responseBox.style.borderColor = "#bfdbfe";
    responseBox.style.color = "#1e40af";

    // Gather form data (including PIN for Column G)
    const formData = new URLSearchParams();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("pin", pin);
    formData.append("message", message);

    // Send data to Google Apps Script via POST
    fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors", // Required for Google Apps Script web apps to avoid CORS preflight blocks from static frontends
        body: formData
    })
    .then(() => {
        responseBox.style.display = "block";
        responseBox.innerHTML =
            "<strong>うけつけました！(Success!)</strong> Your check-in has been submitted and recorded.<br>" +
            "<small>せんせいのかくにんのあと、「りれきをみる」でへんじが見られます。</small>";
        document.getElementById('checkinForm').reset();

        // Pre-fill history lookup fields so checking past entries is quick
        const lookupEmail = document.getElementById('lookupEmail');
        const lookupPin = document.getElementById('lookupPin');
        if (lookupEmail) lookupEmail.value = email;
        if (lookupPin) lookupPin.value = pin;
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

// View semester history (latest on top)
const historyBtn = document.getElementById('historyBtn');
if (historyBtn) {
    historyBtn.addEventListener('click', function() {
        const lookupEmail = document.getElementById('lookupEmail') ? document.getElementById('lookupEmail').value.trim() : "";
        const lookupPin = document.getElementById('lookupPin') ? document.getElementById('lookupPin').value.trim() : "";
        const historyCount = document.getElementById('historyCount');
        const historyList = document.getElementById('history-list');

        if (!lookupEmail || !lookupPin) {
            if (historyCount) {
                historyCount.textContent = "メールアドレスと4けたのばんごうを入れてください。(Enter email & PIN.)";
            }
            return;
        }

        historyBtn.disabled = true;
        historyBtn.textContent = "よみこみちゅう... (Loading...)";
        if (historyList) historyList.innerHTML = "";
        if (historyCount) historyCount.textContent = "";

        const url = WEB_APP_URL +
            "?email=" + encodeURIComponent(lookupEmail) +
            "&pin=" + encodeURIComponent(lookupPin);

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    if (historyCount) {
                        historyCount.textContent = "かくにんずみチェックイン (Approved Check-ins): " + data.count + " かい";
                    }
                    if (historyList) {
                        if (!data.history || data.history.length === 0) {
                            historyList.innerHTML = "<p style='color:#64748b;font-size:0.9rem;'>まだ承認されたチェックインがありません。(No approved check-ins found yet.)</p>";
                        } else {
                            data.history.forEach(item => {
                                const card = document.createElement('div');
                                card.className = 'history-card';
                                card.innerHTML =
                                    "<div class='history-date'>" + escapeText(item.date) + "</div>" +
                                    "<div class='history-student'>" + escapeText(item.message) + "</div>" +
                                    "<div class='history-reply'><strong>せんせい:</strong> " + escapeText(item.reply) + "</div>";
                                historyList.appendChild(card);
                            });
                        }
                    }
                } else if (historyCount) {
                    historyCount.textContent = "エラー: " + (data.message || "Could not load history.");
                }
            })
            .catch(err => {
                console.error("History error:", err);
                if (historyCount) {
                    historyCount.textContent = "よみこみエラーが発生しました。(Error loading history.)";
                }
            })
            .finally(() => {
                historyBtn.disabled = false;
                historyBtn.textContent = "りれきをみる (View My History)";
            });
    });
}

function escapeText(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
}
