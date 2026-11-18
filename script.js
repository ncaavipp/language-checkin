// Corrected Google Apps Script Web App URL (closed the missing quote)
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwEGj58P9NeIUeW3wxSa9E607BwL42HxKnIKRjI4ndxsR2Mxwd1cXozWn3EG1PVeD5fbg/exec";

document.getElementById('checkinForm').addEventListener('submit', function(e) {
    // Prevent the default browser form submission / page reload
    e.preventDefault();

    const btn = document.getElementById('submitBtn');
    const responseBox = document.getElementById('response-box');
    
    // UI state: Loading
    btn.textContent = "Sending...";
    btn.disabled = true;
    responseBox.style.display = "none";

    // Gather form data
    const formData = new URLSearchParams();
    formData.append("name", document.getElementById('name').value);
    formData.append("email", document.getElementById('email').value);
    formData.append("message", document.getElementById('message').value);

    // Send data to Google Apps Script via POST
    fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors", // Required for Google Apps Script web apps to avoid CORS preflight blocks from static frontends
        body: formData
    })
    .then(() => {
        // Since 'no-cors' returns an opaque response, we assume success once the fetch completes
        responseBox.style.display = "block";
        responseBox.innerHTML = "<strong>Success!</strong> Your check-in has been submitted and recorded.";
        document.getElementById('checkinForm').reset();
    })
    .catch(error => {
        console.error("Error:", error);
        responseBox.style.display = "block";
        responseBox.style.background = "#fee2e2";
        responseBox.style.borderColor = "#fca5a5";
        responseBox.style.color = "#991b1b";
        responseBox.innerHTML = "<strong>Error!</strong> Could not connect to the server. Please try again.";
    })
    .finally(() => {
        btn.textContent = "Submit Check-in";
        btn.disabled = false;
    });
});
