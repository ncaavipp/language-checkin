// Paste your new Google Apps Script Web App URL ending in /exec here
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwEGj58P9NeIUeW3wxSa9E607BwL42HxKnIKRjI4ndxsR2Mxwd1cXozWn3EG1PVeD5fbg/exec

// Set the form action dynamically to your Apps Script URL
document.getElementById('checkinForm').action = WEB_APP_URL;

document.getElementById('checkinForm').addEventListener('submit', function(e) {
    const btn = document.getElementById('submitBtn');
    const responseBox = document.getElementById('response-box');
   
    btn.textContent = "Sending...";
    btn.disabled = true;
   
    // Show success message immediately after submission
    setTimeout(function() {
        responseBox.style.display = "block";
        responseBox.innerHTML = "<strong>Success!</strong> Your check-in has been submitted and is pending review.";
        document.getElementById('checkinForm').reset();
        btn.textContent = "Submit Check-in";
        btn.disabled = false;
    }, 1000); // 1-second delay for smooth UX
});
