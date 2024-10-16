document.getElementById('saranForm').addEventListener('submit', function(event) {
    event.preventDefault();
    console.log("Form submit berhasil");
    const saran = document.getElementById('saran').value;
    if (saran.trim()) {
        alert('Terima Kasih Atas Sarannya ');
        window.location.href = 'index.html'; // Kembali ke halaman utama setelah submit
    } else {
        alert('Silakan tulis saran Anda.');
    }
});

const submitButton = document.getElementById('submitButton');

submitButton.addEventListener('click', function() {
    submitButton.innerHTML = 'Mengirim...';
    submitButton.disabled = true;

    setTimeout(() => {
        submitButton.innerHTML = 'Kirim';
        submitButton.disabled = false;
    }, 2000);
});
