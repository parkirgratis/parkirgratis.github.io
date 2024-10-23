document.addEventListener('DOMContentLoaded', function() {
    // Login function
    async function login(username, password) {
        try {
            const response = await fetch('https://asia-southeast2-backend-438507.cloudfunctions.net/parkirgratisbackend/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ Username: username, Password: password })
            });

            const data = await response.json();

            if (response.status === 200) {
                localStorage.setItem('token', data.token);
                alert('Login successful');
                window.location.href = '../admin/admin.html';
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Login failed');
        }
    }

   
    document.getElementById('loginForm').addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        login(username, password);
    });

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
        inputs.forEach(input => input.classList.toggle('dark-mode'));

        // Toggle icon
        const darkModeIcon = document.getElementById('darkModeIcon');
        darkModeIcon.classList.toggle('fa-moon');
        darkModeIcon.classList.toggle('fa-sun');
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const darkModeIcon = document.getElementById("darkModeIcon");

    // Check the initial theme and set the correct icon
    if (localStorage.getItem("theme") === "dark" || window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
        darkModeIcon.classList.remove("fa-sun");
        darkModeIcon.classList.add("fa-moon");
    } else {
        document.documentElement.classList.remove("dark");
        darkModeIcon.classList.remove("fa-moon");
        darkModeIcon.classList.add("fa-sun");
    }

    // Toggle between light and dark mode
    darkModeToggle.addEventListener("click", () => {
        document.documentElement.classList.toggle("dark");
        if (document.documentElement.classList.contains("dark")) {
            darkModeIcon.classList.remove("fa-sun");
            darkModeIcon.classList.add("fa-moon");
            localStorage.setItem("theme", "dark");
        } else {
            darkModeIcon.classList.remove("fa-moon");
            darkModeIcon.classList.add("fa-sun");
            localStorage.setItem("theme", "light");
        }
    });
});
