const WEB_APP_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

document.getElementById('checkinForm').addEventListener('submit', function(e) {
    e.preventDefault();
   
    const btn = document.getElementById('submitBtn');
    const responseBox = document.getElementById('response-box');
   
    const payload = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
   
    btn.textContent = "Sending...";
    btn.disabled = true;
   
    fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors", // Required for Google Apps Script endpoints
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(() => {
        responseBox.style.display = "block";
        responseBox.innerHTML = "<strong>Success!</strong> Your check-in has been submitted and is pending instructor review.";
        document.getElementById('message').value = '';
        btn.textContent = "Submit Check-in";
        btn.disabled = false;
    })
    .catch(error => {
        console.error('Error:', error);
        responseBox.style.display = "block";
        responseBox.style.background = "#fee2e2";
        responseBox.style.color = "#991b1b";
        responseBox.innerHTML = "There was an error submitting your check-in. Please try again.";
        btn.textContent = "Submit Check-in";
        btn.disabled = false;
    });
});
