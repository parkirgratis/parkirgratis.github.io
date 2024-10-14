document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('https://asia-southeast2-backend-438507.cloudfunctions.net/parkirgratisbackend/admin/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (response.ok) {
        // Redirect to the admin page
        window.location.href = '/admin/admin.html';
    } else {
        document.getElementById('message').textContent = result.message;
    }
});

document.getElementById('togglePassword').addEventListener('click', function() {
    const passwordField = document.getElementById('password');
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});

document.getElementById('darkModeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    document.querySelector('.login-container').classList.toggle('dark-mode');
    document.querySelector('footer').classList.toggle('dark-mode');

    const inputs = document.querySelectorAll('input, .login-button');
    inputs.forEach(input => {
        input.classList.toggle('dark-mode');
    });

    // Change button text
    const isDarkMode = document.body.classList.contains('dark-mode');
    this.textContent = isDarkMode ? 'Light Mode' : 'Night Mode';
});

