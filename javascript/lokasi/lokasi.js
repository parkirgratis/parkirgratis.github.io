import 'https://cdn.skypack.dev/ol/ol.css';
import Map from 'https://cdn.skypack.dev/ol/Map';
import View from 'https://cdn.skypack.dev/ol/View';
import { Tile as TileLayer } from 'https://cdn.skypack.dev/ol/layer';
import OSM from 'https://cdn.skypack.dev/ol/source/OSM';
import { Feature } from 'https://cdn.skypack.dev/ol';
import { Point } from 'https://cdn.skypack.dev/ol/geom';
import { fromLonLat } from 'https://cdn.skypack.dev/ol/proj';
import { Icon, Style } from 'https://cdn.skypack.dev/ol/style';
import VectorSource from 'https://cdn.skypack.dev/ol/source/Vector';
import VectorLayer from 'https://cdn.skypack.dev/ol/layer/Vector';

let map;

// Menampilkan popup untuk meminta izin lokasi
document.addEventListener("DOMContentLoaded", () => {
    const permissionPopup = document.getElementById("permission-popup");

    if (navigator.geolocation) {
        permissionPopup.style.display = "flex"; // Tampilkan popup
    } else {
        alert("Geolocation tidak didukung oleh browser ini.");
    }
});

// Fungsi untuk meminta lokasi dan menampilkan peta
function requestLocation() {
    const permissionPopup = document.getElementById("permission-popup");
    permissionPopup.style.display = "none"; // sembunyikan popup

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

            // Inisialisasi dan tampilkan peta OpenLayers
            map = new Map({
                target: 'map',
                layers: [
                    new TileLayer({
                        source: new OSM(),
                    }),
                ],
                view: new View({
                    center: fromLonLat([longitude, latitude]),
                    zoom: 15,
                }),
            });

            // Tambahkan marker untuk lokasi pengguna
            const marker = new Feature({
                geometry: new Point(fromLonLat([longitude, latitude])),
            });
            marker.setStyle(
                new Style({
                    image: new Icon({
                        src: '../img/location-marker.png',
                        scale: 0.05,
                    }),
                })
            );

            const vectorSource = new VectorSource({
                features: [marker],
            });
            const vectorLayer = new VectorLayer({
                source: vectorSource,
            });
            map.addLayer(vectorLayer);
        },
        (error) => {
            console.error("Gagal mendapatkan lokasi:", error.message);
            alert("Gagal mendapatkan lokasi. Silakan aktifkan GPS atau izinkan akses lokasi.");
        }
    );
}



window.requestLocation = requestLocation;
