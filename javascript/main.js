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
function addUserLocationMarker() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Dapatkan koordinat pengguna
                const userCoordinates = [
                    position.coords.longitude,
                    position.coords.latitude
                ];

                // Tambahkan marker untuk lokasi pengguna
                const userMarker = new Feature({
                    geometry: new Point(fromLonLat(userCoordinates)),
                });

                userMarker.setStyle(
                    new Style({
                        image: new Icon({
                            anchor: [0.5, 1],
                            src: 'https://i.ibb.co/8dtr6zc/man.png', // URL gambar marker pengguna
                            scale: 1.0,
                        }),
                    })
                );

                const vectorSource = new VectorSource({
                    features: [userMarker],
                });

                const vectorLayer = new VectorLayer({
                    source: vectorSource,
                });

                map.addLayer(vectorLayer);

                map.getView().setCenter(fromLonLat(userCoordinates));
                map.getView().setZoom(17);

                // Cari lokasi parkir terdekat
                findNearestParking(userCoordinates);
            },
            (error) => {
                console.error('Error mendapatkan lokasi pengguna:', error);
                Swal.fire({
                    icon: "warning",
                    title: "Gagal mengakses lokasi",
                    text: "Tidak dapat mengakses lokasi Anda. Pastikan izin lokasi diaktifkan."
                });
            }
        );
    } else {
        Swal.fire({
            icon: "warning",
            title: "Geolocation tidak didukung",
            text: "Geolocation tidak didukung oleh browser ini."
        });
    }
}

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

    console.log("Jarak yang dihitung:", distance);
    return distance;
}


// Fungsi untuk menemukan lokasi parkir terdekat
function findNearestParking(userCoordinates) {
    console.log("Lokasi pengguna:", userCoordinates);

    let nearestLocation = null;
    let minDistance = Infinity;

    popupsData.forEach(({ coordinate, content }) => {
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
        displayPopupForCoordinate(nearestLocation.coordinate, nearestLocation.content);

        Swal.fire({
            icon: "info",
            title: "Lokasi Parkir Ditemukan",
            text: `Lokasi parkir terdekat ditemukan! Jarak: ${minDistance.toFixed(2)} km`
        });
    } else {
        Swal.fire({
            icon: "warning",
            title: "Tidak Ada Lokasi Parkir",
            text: "Tidak ada lokasi parkir terdekat yang ditemukan."
        });
    }
}

// Panggil fungsi ini saat halaman dimuat
document.addEventListener('DOMContentLoaded', addUserLocationMarker);