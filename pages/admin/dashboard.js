document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('You need to log in first');
        window.location.href = '../login/login.html';
        return;
    }

    try {
        const response = await fetch('https://asia-southeast2-backend-438507.cloudfunctions.net/parkirgratisbackend/admin/dashboard', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        const data = await response.json();

        if (response.status === 200) {
            if (!localStorage.getItem('alertShown')) {
                alert('Dashboard access successful\nMessage: ' + data.message + '\nAdmin id: ' + data.admin_id);
                localStorage.setItem('alertShown', 'true');
            }
        } else {
            alert('Unauthorized access\nMessage: ' + data.message);
            window.location.href = '../login/login.html';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Unauthorized access\nError: ' + error.message);
        window.location.href = '../login/login.html';
    }
});