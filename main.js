import Map from 'https://cdn.skypack.dev/ol/Map.js';
import View from 'https://cdn.skypack.dev/ol/View.js';
import TileLayer from 'https://cdn.skypack.dev/ol/layer/Tile.js';
import OSM from 'https://cdn.skypack.dev/ol/source/OSM.js';
import Overlay from 'https://cdn.skypack.dev/ol/Overlay.js';
import { fromLonLat } from 'https://cdn.skypack.dev/ol/proj.js'; // Import untuk mengkonversi koordinat

// Inisialisasi peta
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: fromLonLat([107.6098, -6.9175]), // Konversi koordinat menggunakan fromLonLat
    zoom: 12
  })
});

// Buat sebuah overlay untuk menampilkan marker
const marker = new Overlay({
  position: fromLonLat([107.6098, -6.9175]), // Koordinat Kota Bandung
  positioning: 'center-center',
  element: document.createElement('div'),
  stopEvent: false // Agar overlay tidak menghentikan event pada peta
});

// Set isi dari elemen overlay sebagai gambar marker
marker.getElement().innerHTML = '<img src="marker.png" alt="Marker" style="width: 20px; height: 20px;">';

// Tambahkan overlay ke dalam peta
map.addOverlay(marker);

// Buat overlay untuk marker pertama (Kota Bandung)
const markerkesatu = new Overlay({
  position: fromLonLat([-6.874172843889921, 107.58030033050544]), // Koordinat Kota Bandung
  positioning: 'center-center',
  element: document.createElement('div'),
  stopEvent: false
});
markerkesatu.getElement().innerHTML = '<img src="marker.png" alt="Marker" style="width: 20px; height: 20px;">';
map.addOverlay(markerkesatu);

// Buat overlay untuk marker kedua
const markerKedua = new Overlay({
  position: fromLonLat([107.57806170827054, -6.87616450819235]), // Koordinat marker kedua
  positioning: 'center-center',
  element: document.createElement('div'),
  stopEvent: false
});
markerKedua.getElement().innerHTML = '<img src="marker.png" alt="Marker" style="width: 20px; height: 20px;">';
map.addOverlay(markerKedua);


// Buat overlay untuk marker ketiga
const markerketiga = new Overlay({
  position: fromLonLat([107.57443704813844, -6.865543210439596]), // Koordinat marker ketiga
  positioning: 'center-center',
  element: document.createElement('div'),
  stopEvent: false
});
markerketiga.getElement().innerHTML = '<img src="marker.png" alt="Marker" style="width: 20px; height: 20px;">';
map.addOverlay(markerketiga);



// Buat overlay untuk menampilkan deskripsi tempat
const popup = new Overlay({
  element: document.createElement('div'),
  autoPan: true,
  autoPanAnimation: {
    duration: 250
  }
});
map.addOverlay(popup);

// Fungsi untuk menampilkan deskripsi tempat pada overlay saat marker diklik
function displayPopup(coordinate, content) {
  popup.getElement().innerHTML = content;
  popup.setPosition(coordinate);
  popup.setPositioning('bottom-center');
}

// Tambahkan event listener untuk marker kedua
markerKedua.getElement().addEventListener('click', function() {
  const coordinate = markerKedua.getPosition();
  const content = `
    <div style="background-color: white; padding: 10px;">
      <table>
        <tr>
          <th>Deskripsi</th>
          <td>Deskripsi tempat kedua</td>
        </tr>
        <tr>
          <th>Informasi</th>
          <td>Informasi tambahan</td>
        </tr>
      </table>
    </div>`;
  displayPopup(coordinate, content);
});

// Tambahkan event listener untuk marker ketiga
markerketiga.getElement().addEventListener('click', function() {
  const coordinate = markerketiga.getPosition();
  const content = `
    <div style="background-color: white; padding: 10px;">
      <table>
        <tr>
          <th>Deskripsi</th>
          <td>Deskripsi tempat ketiga</td>
        </tr>
        <tr>
          <th>Informasi</th>
          <td>Informasi tambahan</td>
        </tr>
      </table>
    </div>`;
  displayPopup(coordinate, content);
});

// Tambahkan event listener untuk peta
map.on('click', function(event) {
  popup.setPosition(null);
});

// Tambahkan event listener untuk marker kedua
markerKedua.getElement().addEventListener('click', function() {
  const coordinate = markerKedua.getPosition();
  const content = `
    <div style="background-color: white; padding: 10px;">
      <table>
        <tr>
          <th>Deskripsi</th>
          <td>Deskripsi tempat kedua</td>
        </tr>
        <tr>
          <th>Informasi</th>
          <td>Informasi tambahan</td>
        </tr>
      </table>
    </div>`;
  displayPopup(coordinate, content);
});

// Tambahkan event listener untuk marker ketiga
markerketiga.getElement().addEventListener('click', function() {
  const coordinate = markerketiga.getPosition();
  const content = `
    <div style="background-color: white; padding: 10px;">
      <table>
        <tr>
          <th>Deskripsi</th>
          <td>Deskripsi tempat ketiga</td>
        </tr>
        <tr>
          <th>Informasi</th>
          <td>Informasi tambahan</td>
        </tr>
      </table>
    </div>`;
  displayPopup(coordinate, content);
});
