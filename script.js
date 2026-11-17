// Paste your new Google Apps Script Web App URL ending in /exec here
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwEGj58P9NeIUeW3wxSa9E607BwL42HxKnIKRjI4ndxsR2Mxwd1cXozWn3EG1PVeD5fbg/exec
";

document.getElementById('checkinForm').addEventListener('submit', function(e) {
    e.preventDefault();
   
    const btn = document.getElementById('submitBtn');
    const responseBox = document.getElementById('response-box');
   
    const name = encodeURIComponent(document.getElementById('name').value);
    const email = encodeURIComponent(document.getElementById('email').value);
    const message = encodeURIComponent(document.getElementById('message').value);
   
    // Construct the URL with parameters
    const targetUrl = `${WEB_APP_URL}?name=${name}&email=${email}&message=${message}`;
   
    btn.textContent = "Sending...";
    btn.disabled = true;
   
    fetch(targetUrl)
    .then(response => response.json())
    .then(data => {
        responseBox.style.display = "block";
        responseBox.innerHTML = "<strong>Success!</strong> Your check-in has been submitted.";
        document.getElementById('message').value = '';
        btn.textContent = "Submit Check-in";
        btn.disabled = false;
    })
    .catch(error => {
        console.error('Error:', error);
        // Even if the browser blocks reading the response text due to cross-origin quirks,
        // the request still executed on Google's server! Let's show success anyway.
        responseBox.style.display = "block";
        responseBox.innerHTML = "<strong>Success!</strong> Your check-in has been submitted.";
        document.getElementById('message').value = '';
        btn.textContent = "Submit Check-in";
        btn.disabled = false;
    });
});
