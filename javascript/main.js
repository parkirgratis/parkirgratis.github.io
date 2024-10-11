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
  getFileSize
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

let markerCoords = [];
let popupsData = [];

// Fetch marker data
fetch('https://asia-southeast2-fit-union-424704-a6.cloudfunctions.net/parkirgratisbackend/data/marker')
    .then(response => response.json())
    .then(data => {
        if (!Array.isArray(data.markers)) {
            console.error('Data marker bukan array:', data);
            return;
        }
        markerCoords = data.markers;
        console.log('Koordinat Marker:', markerCoords);
        fetchPopupData();
    })
    .catch(error => console.error('Gagal mengambil data marker:', error));

// Fetch popup data
function fetchPopupData() {
    fetch('https://asia-southeast2-fit-union-424704-a6.cloudfunctions.net/parkirgratisbackend/data/lokasi')
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data)) {
                console.error('Popup data bukan array:', data);
                return;
            }
            popupsData = data.filter(item => item.lon && item.lat && item.nama_tempat && item.lokasi && item.fasilitas && item.gambar)
                             .map(item => ({
                                 coordinate: [item.lon, item.lat],
                                 content: `
                                    <div class="popup-content">
                                        <img src="${item.gambar}" alt="Gambar Tempat" style="width:100%; height:auto;">
                                        <table>
                                            <tr><th class="text-title">Nama Tempat</th><td>${item.nama_tempat}</td></tr>
                                            <tr><th class="text-title">Lokasi</th><td>${item.lokasi}</td></tr>
                                            <tr><th class="text-title">Fasilitas</th><td>${item.fasilitas}</td></tr>
                                        </table>
                                    </div>`
                             }));
            console.log('Popup Data:', popupsData);
            initializeMapPopups();
        })
        .catch(error => console.error('Error fetching popup data:', error));
}

let popups = [];
const markersMap = new Map();

function initializeMapPopups() {
    popups = createPopups(map, popupsData.map(item => ({
        coordinate: item.coordinate,
        content: item.content
    })));
    createMapMarkers();
}

function createMapMarkers() {
    markerCoords.forEach(coord => {
        const marker = createMarker(map, coord);
        markersMap.set(coord.toString(), marker);
    });

    popupsData.forEach(({ coordinate, content }) => {
        const marker = markersMap.get(coordinate.toString());
        if (marker) {
            marker.getElement().addEventListener('click', () => {
                displayPopupForCoordinate(coordinate, content);
            });
        }
    });
}

function displayPopupForCoordinate(coordinate, content) {
    const popupIndex = popupsData.findIndex(item => item.coordinate.toString() === coordinate.toString());
    if (popupIndex !== -1) {
        const { popup } = popups[popupIndex];
        displayPopup(popup, coordinate, content);
        map.getView().animate({ center: fromLonLat(coordinate), zoom: 14 });
    } else {
        console.error('Popup tidak ditemukan untuk koordinat:', coordinate);
    }
}

map.on('click', function(event) {
    popups.forEach(({ popup }) => {
        popup.setPosition(null);

});
    document.getElementById('placeForm').style.display = 'none';
});

window.uploadImage = uploadImage;

const target_url =
  "https://asia-southeast2-fit-union-424704-a6.cloudfunctions.net/parkirgratisbackend/upload/img";

function uploadImage() {
  if (!getValue("imageInput")) {
    alert("Please select an image file");
    return;
  }
  hide("inputfile");
  let besar = getFileSize("imageInput");
  setInner("isi", besar);
  
  postFile(target_url, "imageInput", "img", renderToHtml)
}

// Fungsi untuk menangani respons unggahan
function renderToHtml(result) {
  console.log(result);
  setInner("isi", "https://parkirgratis.github.io/filegambar/" + result.response); // Mengatur isi elemen dengan ID isi menjadi URL yang menggabungkan hasil respons dari server
  show("inputfile"); // Menampilkan kembali elemen dengan ID inputfile
}

// Fungsi untuk menangani kesalahan unggahan
function handleUploadError(error) {
  console.error(error);
  if (error.status === 409) {
    alert("File already exists or there is a conflict. Please try again with a different file.");
  } else {
    alert("An error occurred during the upload. Please try again.");
  }
  show("inputfile"); // Menampilkan kembali elemen inputfile
}

document.getElementById('placeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    uploadImage();

    // Mengambil data dari form
    const placeName = document.getElementById('placeName').value;
    const location = document.getElementById('location').value;
    const facilities = document.getElementById('facilities').value;
    const coordinates = document.getElementById('coordinates').value.split(',').map(Number);
    const image = document.getElementById('imageInput').files[0].name; // Mengambil hanya nama file

    // Membuat objek untuk dikirim sebagai JSON
    const data = {
        nama_tempat: placeName,
        lokasi: location,
        fasilitas: facilities,
        lat: coordinates[0],
        lon: coordinates[1],
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
            alert('Berhasil Menyimpan Data');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat mengirim data.');
    });

    // Prepare coordinates data for koordinat endpoint
    const coordData = {
        markers: [
            [coordinates[1], coordinates[0]]
        ]
    };

    fetch('https://asia-southeast2-fit-union-424704-a6.cloudfunctions.net/parkirgratisbackend/koordinat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(coordData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Coordinates saved successfully:', data);
        alert('Coordinates added successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to add place or save coordinates!');
    });
});


document.getElementById('showFormButton').addEventListener('click', function() {
    const form = document.getElementById('placeForm');
    if (form.style.display === 'block') {
        form.style.display = 'none';
    } else {
        form.style.display = 'block';
    }
});

