document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    
    // Logging untuk debugging
    console.log('Token dari localStorage:', token);

    if (!token) {
        alert('Anda perlu login terlebih dahulu');
        window.location.href = '../login/login.html';
        return;
    }

    try {
        const response = await fetch('https://asia-southeast2-backend-438507.cloudfunctions.net/parkirgratisbackend/admin/dashboard', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        });

        const text = await response.text();
        console.log('Raw response:', text);
        
        // Logging respons status dan headers
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        // Mengecek apakah respons berformat JSON
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            try {
                const data = JSON.parse(text);
                console.log('Parsed response JSON:', data);

                if (response.status === 200) {
                    if (!localStorage.getItem('alertShown')) {
                        alert('Akses dashboard berhasil\nPesan: ' + data.message + '\nAdmin ID: ' + data.admin_id);
                        localStorage.setItem('alertShown', 'true');
                    }
                } else {
                    alert('Akses tidak terotorisasi\nPesan: ' + data.message);
                    window.location.href = '../login/login.html';
                }
            } catch (err) {
                console.error('Error parsing JSON:', err);
                alert('Kesalahan: Tidak dapat mengurai respons JSON');
            }
        } else {
            console.error('Kesalahan: Diharapkan JSON tetapi menerima:', contentType);
            alert('Kesalahan: Server tidak mengembalikan respons JSON yang valid');
        }

    } catch (error) {
        console.error('Kesalahan:', error);
        alert('Akses tidak terotorisasi\nKesalahan: ' + error.message);
        window.location.href = '../login/login.html';
    }
});
