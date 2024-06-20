document.addEventListener('DOMContentLoaded', function() {
    const formChoice = document.getElementById('formChoice');
    const placeForm = document.getElementById('placeForm');
    const displayDataForm = document.getElementById('displayDataForm');
    const dataDisplayTable = document.getElementById('dataDisplayTable').getElementsByTagName('tbody')[0];

    // Fungsi untuk mengatur tampilan form berdasarkan pilihan
    function toggleForms() {
        const choice = formChoice.value;
        console.log("Pilihan Form: ", choice); // Debug: Cek pilihan form
        hideAllForms(); // Sembunyikan semua form termasuk form update
        if (choice === 'placeForm') {
            placeForm.classList.add('active');
            placeForm.style.display = 'block';
            console.log("Place Form Aktif"); // Debug: Cek status Place Form
        } else if (choice === 'displayDataForm') {
            displayDataForm.classList.add('active');
            displayDataForm.style.display = 'block';
            console.log("Display Data Form Aktif"); // Debug: Cek status Display Data Form
        }
    }

    // Fungsi untuk menyembunyikan semua form
    function hideAllForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.style.display = 'none';
        });
    }

    // Fungsi untuk menampilkan form update dengan data yang akan diubah
    function showUpdateForm(row) {
        hideAllForms(); // Sembunyikan semua form lainnya
        const updateForm = document.getElementById('updateDataForm');
        updateForm.style.display = 'block'; // Menampilkan hanya form update

        // Mengambil data dari baris yang diklik
        const namaTempat = row.cells[0].textContent;
        const lokasi = row.cells[1].textContent;
        const fasilitas = row.cells[2].textContent;
        const koordinat = row.cells[3].textContent.split(', ');
        const lon = koordinat[0];
        const lat = koordinat[1];

        // Mengisi form dengan data yang ada
        document.getElementById('updatePlaceName').value = namaTempat;
        document.getElementById('updateLocation').value = lokasi;
        document.getElementById('updateFacilities').value = fasilitas;
        document.getElementById('updateCoordinates').value = `${lon}, ${lat}`;
    }

    // Fungsi untuk memperbarui data
    function updateData(button) {
        const row = button.closest('tr');
        const namaTempat = row.cells[0].textContent;
        const lokasi = row.cells[1].textContent;
        const fasilitas = row.cells[2].textContent;
        const koordinat = row.cells[3].textContent.split(', ');
        const lon = koordinat[0];
        const lat = koordinat[1];
        const id = row.getAttribute('data-id'); // Pastikan ID tersimpan sebagai atribut data-id pada setiap baris

        const dataToUpdate = {
            id: id,
            nama_tempat: namaTempat,
            lokasi: lokasi,
            fasilitas: fasilitas,
            lon: lon,
            lat: lat
        };

        fetch('https://asia-southeast2-fit-union-424704-a6.cloudfunctions.net/parkirgratisbackend/data/tempat', { // Ganti 'URL_API/tempat' dengan URL yang sesuai
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToUpdate)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Update berhasil:', data);
            alert('Data berhasil diperbarui.');
        })
        .catch(error => {
            console.error('Error updating data:', error);
            alert('Gagal memperbarui data.');
        });
    }

    // Fungsi untuk menghapus data
    function deleteData(button) {
        const row = button.closest('tr');
        const id = row.getAttribute('data-id'); // Mengambil ID dari atribut data-id

        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) { // Popup konfirmasi
            fetch(`https://asia-southeast2-fit-union-424704-a6.cloudfunctions.net/parkirgratisbackend/data/tempat/${id}`, { // Ganti dengan URL API Anda
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    row.remove(); // Hapus baris dari tabel jika penghapusan berhasil
                    alert('Data berhasil dihapus.');
                } else {
                    throw new Error('Gagal menghapus data');
                }
            })
            .catch(error => {
                console.error('Error deleting data:', error);
                alert('Gagal menghapus data.');
            });
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
                row.setAttribute('data-id', item.id); // Menambahkan atribut data-id pada setiap baris
            });
        })
        .catch(error => console.error('Error loading the data: ', error));

    dataDisplayTable.addEventListener('click', function(event) {
        const target = event.target;
        if (target.tagName === 'BUTTON' && target.textContent === 'Update') {
            const row = target.closest('tr');
            showUpdateForm(row);
        } else if (target.tagName === 'BUTTON' && target.textContent === 'Hapus') {
            deleteData(target);
        }
    });
});
