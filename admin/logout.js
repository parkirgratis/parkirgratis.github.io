async function logout() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('You are not logged in');
        window.location.href = '../login/login.html';
        return;
    }

    try {
        const response = await fetch('https://asia-southeast2-backend-438507.cloudfunctions.net/parkirgratisbackend/admin/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });

        if (response.status === 200) {
            localStorage.removeItem('token');
            localStorage.removeItem('alertShown');
            alert('Logout successful');
            window.location.href = '../login/login.html';
        } else {
            alert('Logout failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Logout failed');
    }
}

// Event listener for logout button
document.getElementById('logoutButton').addEventListener('click', () => {
    logout();
});