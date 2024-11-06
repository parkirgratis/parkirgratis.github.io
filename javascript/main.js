import Map from 'https://cdn.skypack.dev/ol/Map.js';
import View from 'https://cdn.skypack.dev/ol/View.js';
import TileLayer from 'https://cdn.skypack.dev/ol/layer/Tile.js';
import OSM from 'https://cdn.skypack.dev/ol/source/OSM.js';
import { fromLonLat } from 'https://cdn.skypack.dev/ol/proj.js';
import { createMarker } from '../javascript/controller/markers.js';
import { createPopups, displayPopup } from '../javascript/controller/popups.js';
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

document.addEventListener('DOMContentLoaded', function() {
    requestLocationPermission();
});

function requestLocationPermission() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                document.getElementById('location').innerText = `Latitude: ${lat}, Longitude: ${lon}`;
            },
            function(error) {
                if (error.code === error.PERMISSION_DENIED) {
                    alert("Anda perlu mengaktifkan lokasi/GPS untuk menggunakan aplikasi ini.");
                    showPermissionPopup();
                } else {
                    console.error("Error getting location: ", error);
                    document.getElementById('location').innerText = 'Gagal mendapatkan lokasi.';
                }
            }
        );
    } else {
        alert("Geolocation tidak didukung oleh browser ini.");
    }
}

function showPermissionPopup() {
    document.getElementById('permission-popup').style.display = 'flex';
}

function requestLocation() {
    document.getElementById('permission-popup').style.display = 'none';
    requestLocationPermission();
}


// Fetch marker data
fetch('https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/data/marker')
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
    fetch('https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/data/lokasi')
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
                                   <img src="${item.gambar}" alt="Gambar Tempat" style="width:200%; height:auto; max-height: 200px; object-fit: cover; margin-top: 60px; margin-bottom: -1px; margin-left: -1px;  margin-right: -100px;">
                                     <div class="red-sidebar">
                                      <span class="pr-2"><img src="https://cdn-icons-png.flaticon.com/512/61/61942.png" class="invert w-6 h-6"></span><p class="side-nav-text font-sidebar text-white">INFORMASI LOKASI</p>
                                      </div>
                                        <table>
                                            <tr class = "px-6 py-4 font-sidebar whitespace-no-wrap border-b border-gray-500"> <th class="text-title text-white border-r border-gray-600 bg-lime-500">Nama Tempat</th><td class="px-2">${item.nama_tempat}</td></tr>
                                            <tr  class = "px-6 py-4 font-sidebar whitespace-no-wrap border-b border-gray-500"> <th class="text-title text-white border-r border-gray-600 bg-lime-500">Lokasi</th><td class="px-2">${item.lokasi}</td></tr>
                                            <tr  class = "px-6 py-4 font-sidebar whitespace-no-wrap border-b border-gray-500"> <th class="text-title text-white border-r border-gray-600 bg-lime-500">Fasilitas</th><td class="px-2">${item.fasilitas}</td></tr>
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
        const popupContentContainer = document.getElementById('popup-content-container');
        popupContentContainer.innerHTML = content;
        const popupSidebar = document.getElementById('popup-sidebar');

        // Ensure the sidebar is displayed and slides up on mobile
        popupSidebar.style.display = 'block';
        popupSidebar.classList.add('active'); 
        map.getView().animate({ center: fromLonLat(coordinate), zoom: 20 });
    } else {
        console.error('Popup not found for coordinate:', coordinate);
    }
}


// Event listener to close sidebar on map click
map.on('click', function() {
    document.getElementById('popup-sidebar').style.display = 'none';
});

document.getElementById('toggle-sidebar-btn').addEventListener('click', function() {
    const popupSidebar = document.getElementById('popup-sidebar');
    popupSidebar.classList.toggle('active'); // Toggle the active class to show/hide
});

// Ensure the sidebar is closed when map is clicked
map.on('click', function(event) {
    const popupSidebar = document.getElementById('popup-sidebar');
    popupSidebar.classList.remove('active'); // Hide sidebar on map click
});

window.uploadImage = uploadImage;

const target_url =
  "https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/upload/img";

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
    fetch('https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/tempat-parkir', { 
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

    fetch('https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/koordinat', {
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



function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            document.getElementById('location').innerText = `Latitude: ${lat}, Longitude: ${lon}`;
        }, function(error) {
            console.error('Error getting location: ', error);
            document.getElementById('location').innerText = 'Gagal mendapatkan lokasi.';
        });
    } else {
        alert('Geolocation tidak didukung oleh browser ini.');
    }
}

// Fungsi untuk mendapatkan lokasi pengguna
function getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation tidak didukung oleh browser ini.'));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    });
  }

// Fungsi untuk membuat peta
function createMap(center) {
    return new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: center,
        zoom: 15 // Zoom level yang lebih dekat
      })
    });
  }

  async function initMap() {
    let center = fromLonLat([107.6098, -6.9175]); // Lokasi default (Bandung)
  
    try {
      const position = await getUserLocation();
      center = fromLonLat([position.coords.longitude, position.coords.latitude]);
    } catch (error) {
      console.warn('Tidak bisa mendapatkan lokasi pengguna:', error.message);
    }
  
    const map = createMap(center);
  
    const markerCoords = [
      [107.57806170827054, -6.87616450819235],
      [107.57441932515601, -6.865637836144359],
      [107.58023768006228, -6.8739512071239846],
      [107.55091369885083, -6.8622383054487806],
      [107.57613168830173, -6.8620573920747585],
      [107.6916921488174, -6.901263021760781]
    ];

    const popupsData = [
        {
          coordinate: markerCoords[0],
          content: `<div class="popup-content">
            <h3>Alfamart Sarimanah</h3>
            <p>Lokasi: Sarimanah</p>
          </div>`
        },
        {
          coordinate: markerCoords[1],
          content: `<div class="popup-content">
            <h3>Alfamart Ciwaruga</h3>
            <p>Lokasi: Jl. Ciwaruga-Ters, Jl. Gegerkalong Hilir No.37, RT.01/RW.03, Ciwaruga, Kec. Parongpong, Kabupaten Bandung Barat, Jawa Barat 40559</p>
          </div>`
        },
        {
          coordinate: markerCoords[2],
          content: `<div class="popup-content">
            <h3>Yomart Sarimanah</h3>
            <p>Lokasi: Jl. Sarimanah No.106, Sarijadi, Kec. Sukasari, Kota Bandung, Jawa Barat 40151</p>
          </div>`
        },
        {
          coordinate: markerCoords[3],
          content: `<div class="popup-content">
            <h3>Alfamart Citeureup</h3>
            <p>Lokasi: Jl. Citeureup Kel No.87, Citeureup, Kec. Cimahi Utara, Kota Cimahi, Jawa Barat 40512</p>
          </div>`
        },
        {
          coordinate: markerCoords[4],
          content: `<div class="popup-content">
            <h3>Indomaret Warugajaya</h3>
            <p>Lokasi: 4HQG+5C6, Jalan Waruga Jaya, Ciwaruga, Kec. Parongpong, Kota Bandung, Jawa Barat 40559</p>
          </div>`
        },
        {
          coordinate: markerCoords[5],
          content: `<div class="popup-content">
            <h3>Yomart Jalan Kosar</h3>
            <p>Lokasi: Jl. Simpay Asih, Pasir Endah, Kec. Ujung Berung, Kota Bandung, Jawa Barat 40619</p>
          </div>`
        }
      ];
    
      const markers = markerCoords.map(coord => createMarker(map, coord));
      const popups = createPopups(map, popupsData);
    
      markers.forEach((marker, index) => {
        marker.getElement().addEventListener('click', () => {
          const popup = popups[index];
          displayPopup(popup, popupsData[index].coordinate, popupsData[index].content);
        });
      });
    
      map.on('click', function(event) {
        popups.forEach(popup => {
          popup.setPosition(null);
        });
      });
    }
    
    window.addEventListener('load', initMap);

// Memanggil fungsi getLocation saat DOM sudah sepenuhnya dimuat
window.addEventListener('DOMContentLoaded', (event) => {
    getLocation();
});