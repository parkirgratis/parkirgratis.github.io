import Map from 'https://cdn.skypack.dev/ol/Map.js';
import View from 'https://cdn.skypack.dev/ol/View.js';
import TileLayer from 'https://cdn.skypack.dev/ol/layer/Tile.js';
import OSM from 'https://cdn.skypack.dev/ol/source/OSM.js';
import { fromLonLat } from 'https://cdn.skypack.dev/ol/proj.js';
import { createMarker } from './controller/markers.js';
import { createPopups, displayPopup } from './controller/popups.js';

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
fetch('https://parkirgratis.github.io/data/marker.json')
    .then(response => response.json())
    .then(data => {
        if (!Array.isArray(data.markers)) {
            console.error('Data marker bukan array:', data);
            return;
        }
        console.log('Koordinat Marker:', data.markers);
        createMapMarkers(data.markers); // Membuat marker pada peta
    })
    .catch(error => console.error('Gagal mengambil data marker:', error));


let popupsData = [];
fetch('https://parkirgratis.github.io/data/lokasi.json')
    .then(response => response.json())
    .then(data => {
        if (!Array.isArray(data)) {
            console.error('Popup data is not an array:', data);
            return;
        }
        popupsData = data.filter(item => item.lon && item.lat && item.nama_tempat && item.lokasi && item.fasilitas)
                         .map(item => ({
                             coordinate: [item.lon, item.lat],
                             content: `
                                <div class="popup-content">
                                   
                                    <table>
                                        <tr><th>Nama Tempat</th><td>${item.nama_tempat}</td></tr>
                                        <tr><th>Lokasi</th><td>${item.lokasi}</td></tr>
                                        <tr><th>Fasilitas</th><td>${item.fasilitas}</td></tr>
                                    </table>
                                </div>`
                         }));
        console.log('Popup Data:', popupsData);
        initializeMapPopups(popupsData);
    })
    .catch(error => console.error('Error fetching popup data:', error));
let popups = [];

function initializeMapPopups(popupsData) {
    popups = createPopups(map, popupsData.map(item => ({
        coordinate: [item.lon, item.lat],
        content: `
            <div class="popup-content">
              
                <table>
                    <tr><th>Nama Tempat</th><td>${item.nama_tempat}</td></tr>
                    <tr><th>Lokasi</th><td>${item.lokasi}</td></tr>
                    <tr><th>Fasilitas</th><td>${item.fasilitas}</td></tr>
                </table>
            </div>`
    })));
}

function createMapMarkers(markerCoords) {
    const markers = markerCoords.map(coord => createMarker(map, coord));
    markers.forEach((marker, index) => {
        marker.getElement().addEventListener('click', () => {
            const popup = popups[index];
            const popupData = popupsData[index];
            if (popup && popupData && popupData.coordinate) {
                displayPopup(popup, popupData.coordinate, popupData.content);
                map.getView().animate({ center: fromLonLat(popupData.coordinate), zoom: 14 });
            } else {
                console.error('Popup or popup data not found for marker index:', index);
            }
        });
    });
}

map.on('click', function(event) {
    popups.forEach(popup => {
        popup.setPosition(null);
    });
});
