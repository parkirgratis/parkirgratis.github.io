import Map from 'https://cdn.skypack.dev/ol/Map.js';
import View from 'https://cdn.skypack.dev/ol/View.js';
import TileLayer from 'https://cdn.skypack.dev/ol/layer/Tile.js';
import OSM from 'https://cdn.skypack.dev/ol/source/OSM.js';
import { fromLonLat } from 'https://cdn.skypack.dev/ol/proj.js';
import { createMarker } from './controller/markers.js';
import { createPopups, displayPopup } from './controller/popups.js';
import {
    setInner,
    show,
    hide,
    getValue,
    getFileSize,
  } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.0.6/croot.js";
  import { postFile } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.2/croot.js";

const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM()
        })
    ],
    view: new View({
        center: fromLonLat([107.6098, -6.9175]),
        zoom: 12
    })
});
// Mengambil data koordinat marker dari URL yang diberikan
let markerCoords = [];
fetch('https://asia-southeast2-fit-union-424704-a6.cloudfunctions.net/parkirgratisbackend/data/marker')
    .then(response => response.json())
    .then(data => {
        // Memeriksa apakah data markers adalah array
        if (!Array.isArray(data.markers)) {
            console.error('Data marker bukan array:', data);
            return;
        }
        console.log('Koordinat Marker:', data.markers);
        createMapMarkers(data.markers); // Membuat marker pada peta
    })
    .catch(error => console.error('Gagal mengambil data marker:', error));

// Mengambil data untuk pop-up dari URL yang diberikan
let popupsData = [];
fetch('https://asia-southeast2-fit-union-424704-a6.cloudfunctions.net/parkirgratisbackend/data/lokasi')
    .then(response => response.json())
    .then(data => {
        // Memeriksa apakah data adalah array
        if (!Array.isArray(data)) {
            console.error('Popup data bukan array:', data);
            return;
        }
        // Memfilter dan memetakan data pop-up
        popupsData = data.filter(item => item.lon && item.lat && item.nama_tempat && item.lokasi && item.fasilitas && item.gambar)
                         .map(item => ({
                             coordinate: [item.lon, item.lat],
                             content: `
                                <div class="popup-content">
                                    <img src="${item.gambar}" alt="Gambar Tempat" style="width:100%; height:auto;">
                                    <table>
                                        <tr><th>Nama Tempat</th><td>${item.nama_tempat}</td></tr>
                                        <tr><th>Lokasi</th><td>${item.lokasi}</td></tr>
                                        <tr><th>Fasilitas</th><td>${item.fasilitas}</td></tr>
                                    </table>
                                </div>`
                         }));
        console.log('Popup Data:', popupsData);
        initializeMapPopups(popupsData); // Menginisialisasi pop-up pada peta
    })
    .catch(error => console.error('Error fetching popup data:', error));

// Array untuk menyimpan pop-up
let popups = [];

// Fungsi untuk menginisialisasi pop-up pada peta
function initializeMapPopups(popupsData) {
    popups = createPopups(map, popupsData.map(item => ({
        coordinate: item.coordinate,
        content: item.content
    })));
}

function createMapMarkers(markerCoords) {
    // Membuat penanda (marker) untuk setiap koordinat yang diberikan
    const markers = markerCoords.map(coord => createMarker(map, coord));

    // Menambahkan event listener ke setiap penanda
    markers.forEach((marker, index) => {
        marker.getElement().addEventListener('click', () => {
            // Mengambil pop-up dan data pop-up berdasarkan indeks penanda
            const popup = popups[index];
            const popupData = popupsData[index];

            // Jika pop-up dan data pop-up ditemukan
            if (popup && popupData && popupData.coordinate) {
                // Menampilkan pop-up dengan konten yang sesuai pada koordinat yang diberikan
                displayPopup(popup, popupData.coordinate, popupData.content);

                // Menganimasikan tampilan peta untuk berfokus pada lokasi pop-up dengan zoom tingkat 14
                map.getView().animate({ center: fromLonLat(popupData.coordinate), zoom: 14 });
            } else {
                // Menampilkan pesan kesalahan jika pop-up atau data pop-up tidak ditemukan
                console.error('Popup atau data pop-up tidak ditemukan untuk penanda dengan indeks:', index);
            }
        });
    });
}

map.on('click', function(event) {
    popups.forEach(popup => {
        popup.setPosition(null);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const formChoice = document.getElementById('formChoice');
    const placeForm = document.getElementById('placeForm');
    const displayDataForm = document.getElementById('displayDataForm');
    const dataDisplayTable = document.getElementById('dataDisplayTable').getElementsByTagName('tbody')[0];

    // Fungsi untuk mengatur tampilan form berdasarkan pilihan
    function toggleForms() {
        const choice = formChoice.value;
        if (choice === 'placeForm') {
            placeForm.classList.add('active');
            displayDataForm.classList.remove('active');
        } else if (choice === 'displayDataForm') {
            displayDataForm.classList.add('active');
            placeForm.classList.remove('active');
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
                row.insertCell(0).textContent = item.namaTempat;
                row.insertCell(1).textContent = item.lokasi;
                row.insertCell(2).textContent = item.fasilitas;
                row.insertCell(3).textContent = item.koordinat;
                row.insertCell(4).innerHTML = `<img src="${item.gambar}" style="width: 100px;">`; // Asumsi 'gambar' adalah URL
                row.insertCell(5).innerHTML = `<button type="button" onclick="updateData(this)">Update</button>
                                                <button type="button" onclick="deleteData(this)">Hapus</button>`;
            });
        })
        .catch(error => console.error('Error loading the data: ', error));
});

document.getElementById('placeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Mengambil data dari form
    const placeName = document.getElementById('placeName').value;
    const location = document.getElementById('location').value;
    const facilities = document.getElementById('facilities').value;
    const coordinates = document.getElementById('coordinates').value.split(',').map(Number);
    const image = document.getElementById('image').files[0].name; // Mengambil hanya nama file

    // Membuat objek untuk dikirim sebagai JSON
    const data = {
        nama_tempat: placeName,
        lokasi: location,
        fasilitas: facilities,
        lon: coordinates[1],
        lat: coordinates[0],
        gambar: image
    };

    // Mengirim data ke server menggunakan fetch dengan body berformat JSON
    fetch('https://asia-southeast2-fit-union-424704-a6.cloudfunctions.net/parkirgratisbackend/tempat-parkir', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Data berhasil disimpan!');
            // Menambahkan koordinat ke database
            tambahKoordinatKeDatabase(coordinates);
        } else {
            alert('Gagal menyimpan data: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat mengirim data.');
    });

    function tambahKoordinatKeDatabase(coordinates) {
        const koordinatData = {
            markers: [{
                lon: coordinates[1],
                lat: coordinates[0]
            }]
        };

        fetch('https://asia-southeast2-fit-union-424704-a6.cloudfunctions.net/parkirgratisbackend/koordinat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(koordinatData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Koordinat berhasil ditambahkan ke database.');
            } else {
                console.error('Gagal menambahkan koordinat: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error saat menambahkan koordinat:', error);
        });
    }
});