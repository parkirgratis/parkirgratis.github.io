document.getElementById('saranForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const saranInput = document.getElementById('saran').value;

    if (!saranInput) {
        alert('Saran tidak boleh kosong!');
        return;
    }

    const data = {
        saran_user: saranInput
    };

    try {
        const response = await fetch('https://asia-southeast2-backend-438507.cloudfunctions.net/parkirgratisbackend/data/saran', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Saran berhasil dikirim!');
            document.getElementById('saranForm').reset();
        } else {
            alert('Gagal mengirim saran. Coba lagi.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan. Coba lagi.');
    }
});
