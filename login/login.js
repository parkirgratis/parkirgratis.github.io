document.addEventListener('DOMContentLoaded', function() {
    // Login function
    async function login(username, password) {
        try {
            const response = await fetch('https://asia-southeast2-backend-438507.cloudfunctions.net/parkirgratisbackend/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ User_name: username, Password: password })
            });

            const data = await response.json();

            if (response.status === 200) {
                localStorage.setItem('token', data.token);
                alert('Login successful');
                window.location.href = '/admin/admin.html';
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Login failed');
        }
    }

    // Handle form submission
    document.getElementById('loginForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        login(username, password);
    });

    // Toggle password visibility
    document.getElementById('togglePassword').addEventListener('click', function() {
        const passwordField = document.getElementById('password');
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    // Toggle dark mode
    document.getElementById('darkModeToggle').addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        document.querySelector('.login-container').classList.toggle('dark-mode');
        document.querySelector('footer').classList.toggle('dark-mode');

        const inputs = document.querySelectorAll('input, .login-button');
        inputs.forEach(input => {
            input.classList.toggle('dark-mode');
        });

        // Change button tex
        const isDarkMode = document.body.classList.contains('dark-mode');
        this.textContent = isDarkMode ? 'Light Mode' : 'Night Mode';
    });
});
