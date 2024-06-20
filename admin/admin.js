document.addEventListener('DOMContentLoaded', function() {
    const formChoice = document.getElementById('formChoice');
    const placeForm = document.getElementById('placeForm');
    const displayDataForm = document.getElementById('displayDataForm');
    const dataDisplayTable = document.getElementById('dataDisplayTable').getElementsByTagName('tbody')[0];

    // Fungsi untuk mengatur tampilan form berdasarkan pilihan
    function toggleForms() {
        const choice = formChoice.value;
        console.log("Pilihan Form: ", choice); // Debug: Cek pilihan form
        if (choice === 'placeForm') {
            placeForm.classList.add('active');
            displayDataForm.classList.remove('active');
            console.log("Place Form Aktif"); // Debug: Cek status Place Form
        } else if (choice === 'displayDataForm') {
            displayDataForm.classList.add('active');
            placeForm.classList.remove('active');
            console.log("Display Data Form Aktif"); // Debug: Cek status Display Data Form
        }
    }

    // Event listener untuk perubahan pada dropdown
    formChoice.addEventListener('change', toggleForms);

    // Inisialisasi tampilan form saat pertama kali dimuat
    toggleForms();

    fetch('https://asia-southeast2-fit-union-424704-a6.cloudfunctions.net/parkirgratisbackend/data/lokasi') // Ganti dengan URL API Anda
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const row = dataDisplayTable.insertRow();
                row.insertCell(0).textContent = item.nama_tempat; // Sesuai dengan "nama_tempat"
                row.insertCell(1).textContent = item.lokasi; // Sesuai dengan "lokasi"
                row.insertCell(2).textContent = item.fasilitas; // Sesuai dengan "fasilitas"
                row.insertCell(3).textContent = `${item.lon}, ${item.lat}`; // Menggabungkan "lon" dan "lat" menjadi koordinat
                row.insertCell(4).innerHTML = `<img src="${item.gambar}" style="width: 100px;">`; // Sesuai dengan "gambar"
                row.insertCell(5).innerHTML = `<button type="button" onclick="updateData(this)">Update</button>
                                                <button type="button" onclick="deleteData(this)">Hapus</button>`;
            });
        })
        .catch(error => console.error('Error loading the data: ', error));
});

