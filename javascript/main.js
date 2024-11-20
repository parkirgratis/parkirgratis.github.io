import Feature from 'https://cdn.skypack.dev/ol/Feature.js';
import Point from 'https://cdn.skypack.dev/ol/geom/Point.js';
import VectorSource from 'https://cdn.skypack.dev/ol/source/Vector.js';
import {Vector as VectorLayer} from 'https://cdn.skypack.dev/ol/layer.js';
import {Icon, Style} from 'https://cdn.skypack.dev/ol/style.js';
import Map from 'https://cdn.skypack.dev/ol/Map.js';
import View from 'https://cdn.skypack.dev/ol/View.js';
import TileLayer from 'https://cdn.skypack.dev/ol/layer/Tile.js';
import OSM from 'https://cdn.skypack.dev/ol/source/OSM.js';
import { fromLonLat } from 'https://cdn.skypack.dev/ol/proj.js';
import { createMarker } from '../javascript/controller/markers.js';
import { createPopups, displayPopup } from '../javascript/controller/popups.js';
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import {addCSS} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";

addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

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
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Validasi apakah data adalah array
            if (!Array.isArray(data)) {
                console.error('Popup data bukan array:', data);
                return;
            }

            // Filter dan map data ke format yang sesuai
            popupsData = data
                .filter(item => item.lon && item.lat && item.nama_tempat && item.lokasi && item.fasilitas && item.gambar)
                .map(item => ({
                    coordinate: [item.lon, item.lat],
                    content: `
                        <div class="popup-content">
                            <img src="${item.gambar}" alt="Gambar Tempat" 
                                 style="width:100%; height:auto; max-height: 200px; object-fit: cover; margin-bottom: 10px;">
                            <div class="red-sidebar" style="padding: 5px; background-color: #f56565; color: #fff;">
                                <span><img src="https://cdn-icons-png.flaticon.com/512/61/61942.png" 
                                           style="width: 24px; height: 24px; vertical-align: middle;">
                                </span>
                                <span style="font-weight: bold;">INFORMASI LOKASI</span>
                            </div>
                            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                                <tr>
                                    <th style="text-align: left; background-color: #84cc16; color: #fff; padding: 5px;">Nama Tempat</th>
                                    <td style="padding: 5px;">${item.nama_tempat}</td>
                                </tr>
                                <tr>
                                    <th style="text-align: left; background-color: #84cc16; color: #fff; padding: 5px;">Lokasi</th>
                                    <td style="padding: 5px;">${item.lokasi}</td>
                                </tr>
                                <tr>
                                    <th style="text-align: left; background-color: #84cc16; color: #fff; padding: 5px;">Fasilitas</th>
                                    <td style="padding: 5px;">${item.fasilitas}</td>
                                </tr>
                            </table>
                        </div>
                    `
                }));

            // Log hasil data yang diolah
            console.log('Popup Data:', popupsData);

            // Initialize marker dan layer map
            initializeMapPopups();

            // Panggil marker lokasi pengguna
            addUserLocationMarker();
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
    console.log("Menampilkan popup untuk koordinat:", coordinate);
    console.log("Isi konten popup:", content);

    const popupContentContainer = document.getElementById('popup-content-container');
    popupContentContainer.innerHTML = content;

    const popupSidebar = document.getElementById('popup-sidebar');
    popupSidebar.style.display = 'block';
    popupSidebar.classList.add('active');

    map.getView().animate({ center: fromLonLat(coordinate), zoom: 17 });
}


// Event listener to close sidebar on map click
map.on('click', function() {
    document.getElementById('popup-sidebar').style.display = 'none';
});

// document.getElementById('toggle-sidebar-btn').addEventListener('click', function() {
//     const popupSidebar = document.getElementById('popup-sidebar');
//     popupSidebar.classList.toggle('active'); // Toggle the active class to show/hide
// });

// Ensure the sidebar is closed when map is clicked
map.on('click', function(event) {
    const popupSidebar = document.getElementById('popup-sidebar');
    popupSidebar.classList.remove('active'); // Hide sidebar on map click
});

// Fungsi untuk menambahkan marker pada lokasi pengguna
// Fungsi untuk menambahkan marker pada lokasi pengguna
// Tambahkan marker lokasi pengguna ke peta
function addUserLocationMarker() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Dapatkan koordinat pengguna
                const userCoordinates = [
                    position.coords.longitude,
                    position.coords.latitude
                ];
                console.log("Koordinat pengguna berhasil diperoleh:", userCoordinates);

                // Tambahkan marker untuk lokasi pengguna
                const userMarker = new Feature({
                    geometry: new Point(fromLonLat(userCoordinates)),
                });

                userMarker.setStyle(
                    new Style({
                        image: new Icon({
                            anchor: [0.5, 1], // Pusatkan icon di titik koordinat
                            src: '../img/peopleloca.png', // Path gambar marker pengguna
                            scale: 0.1, // Perkecil ukuran marker
                        }),
                    })
                );

                // Tambahkan marker ke peta
                const vectorSource = new VectorSource({
                    features: [userMarker],
                });

                const vectorLayer = new VectorLayer({
                    source: vectorSource,
                });

                map.addLayer(vectorLayer);

                // Set view peta ke lokasi pengguna
                map.getView().setCenter(fromLonLat(userCoordinates));
                map.getView().setZoom(17);

                // Cari lokasi parkir terdekat
                findNearestParking(userCoordinates);
            },
            (error) => {
                console.error("Error mendapatkan lokasi pengguna:", error);

                // Berikan pesan kepada pengguna jika gagal mendapatkan lokasi
                Swal.fire({
                    title: 'Lokasi Tidak Akurat',
                    text: 'Apakah Anda ingin memperbarui lokasi secara manual?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Ya, perbarui',
                    cancelButtonText: 'Tidak',
                }).then((result) => {
                    if (result.isConfirmed) {
                       
                    }
                });
            }
        );
    } else {
        // Browser tidak mendukung geolocation
        Swal.fire({
            title: 'Lokasi Tidak Akurat',
            text: 'Apakah Anda ingin memperbarui lokasi secara manual?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, perbarui',
            cancelButtonText: 'Tidak',
        }).then((result) => {
            if (result.isConfirmed) {
              
            }
        });
    }
}

// Fungsi untuk menghitung jarak antara dua koordinat (Haversine formula)
function calculateDistance(coord1, coord2) {
    console.log("Koordinat 1:", coord1);
    console.log("Koordinat 2:", coord2);

    const toRadians = (degree) => degree * (Math.PI / 180);

    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;

    const R = 6371; // Radius bumi dalam kilometer
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    console.log("Jarak yang dihitung:", distance, "km");
    return distance;
}

// Fungsi untuk menemukan lokasi parkir terdekat
function findNearestParking(userCoordinates) {
    console.log("Lokasi pengguna:", userCoordinates);

    // Cek apakah `popupsData` berisi data
    if (!popupsData || popupsData.length === 0) {
        console.warn("Data lokasi parkir kosong atau tidak tersedia.");
        return;
    }

    let nearestLocation = null;
    let minDistance = Infinity;

    // Iterasi melalui `popupsData` untuk menemukan lokasi terdekat
    popupsData.forEach(({ coordinate, content }) => {
        if (!Array.isArray(coordinate) || coordinate.length !== 2) {
            console.warn("Koordinat tidak valid:", coordinate);
            return;
        }

        const distance = calculateDistance(userCoordinates, coordinate);

        console.log(`Jarak ke ${coordinate}: ${distance.toFixed(2)} km`);

        if (distance < minDistance) {
            minDistance = distance;
            nearestLocation = { coordinate, content };
        }
    });

    console.log("Lokasi parkir terdekat:", nearestLocation);
    console.log("Jarak terkecil:", minDistance);

    if (nearestLocation) {
        // Tampilkan popup lokasi terdekat
        displayPopupForCoordinate(nearestLocation.coordinate, nearestLocation.content);

        Swal.fire({
            icon: "info",
            title: "Lokasi Parkir Ditemukan",
            text: `Lokasi parkir terdekat ditemukan! Jarak: ${minDistance.toFixed(2)} km`,
        });
    } else {
        Swal.fire({
            icon: "warning",
            title: "Tidak Ada Lokasi Parkir",
            text: "Tidak ada lokasi parkir terdekat yang ditemukan.",
        });
    }
}


// Panggil fungsi ini saat halaman dimuat
document.addEventListener("DOMContentLoaded", addUserLocationMarker);
