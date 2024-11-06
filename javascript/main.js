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

let userLocationMarker = null;

let markerCoords = [];
let popupsData = [];

document.addEventListener('DOMContentLoaded', function() {
    requestLocationPermission();
});

function requestLocationPermission() {
    if (navigator.geolocation) {
        // First check if permission has already been granted
        if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions.query({ name: 'geolocation' })
                .then(permissionStatus => {
                    if (permissionStatus.state === 'granted') {
                        getLocation(); // Permission already granted, get location
                    } else if (permissionStatus.state === 'prompt') {
                        showPermissionPopup(); // Show popup to request permission
                    } else {
                        alert("Akses lokasi ditolak. Anda perlu mengaktifkan lokasi/GPS untuk menggunakan aplikasi ini.");
                    }
                })
                .catch(error => {
                    console.error("Error checking geolocation permission:", error);
                    showPermissionPopup(); // Fallback to showing the popup on error
                });
        } else {
            // For browsers that don't support Permissions API
            showPermissionPopup(); // Show popup to request permission
        }
    } else {
        alert("Geolocation tidak didukung oleh browser ini.");
    }
}

function showPermissionPopup() {
    if (confirm("Aplikasi ini memerlukan akses ke lokasi Anda. Apakah Anda ingin mengaktifkannya?")) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                document.getElementById('location').innerText = `Latitude: ${lat}, Longitude: ${lon}`;
                // Center the map on the user's location
                map.getView().setCenter(fromLonLat([lon, lat]));
                addUserLocationMarker([lon, lat]);
            },
            function(error) {
                if (error.code === error.PERMISSION_DENIED) {
                    alert("Anda perlu mengaktifkan lokasi/GPS untuk menggunakan aplikasi ini.");
                } else {
                    console.error("Error getting location: ", error);
                    document.getElementById('location').innerText = 'Gagal mendapatkan lokasi.';
                }
            }
        );
    } else {
        alert("Anda perlu mengaktifkan lokasi/GPS untuk menggunakan aplikasi ini.");
    }
}

// Fungsi untuk menambahkan marker lokasi pengguna
function addUserLocationMarker(coordinates) {
    if (userLocationMarker !== null) {
        // Update marker position if it already exists
        userLocationMarker.setPosition(fromLonLat(coordinates));
    } else {
        // Create the marker
        userLocationMarker = new ol.Feature({
            geometry: new ol.geom.Point(fromLonLat(coordinates))
        });

        // Add an icon to the marker
        const markerStyle = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1], // Anchor point of the icon
                src: 'https://openlayers.org/examples/data/icon.png' // URL to your icon image
            })
        });
        userLocationMarker.setStyle(markerStyle);
    }
}

window.addEventListener('load', initMap); // Panggil initMap ketika halaman dimuat

// Memanggil fungsi getLocation saat DOM sudah sepenuhnya dimuat
window.addEventListener('DOMContentLoaded', (event) => {
    getLocation();
});

// Fungsi initMap
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
        }
        // Tambahkan data popup lainnya
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
