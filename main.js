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

// Tambahkan overlay ke dalam peta
map.addOverlay(marker);

// Buat overlay untuk marker pertama
const sarimanah1 = new Overlay({
  position: fromLonLat([107.57806170827054, -6.87616450819235]), // Koordinat marker pertama
  positioning: 'center-center',
  element: document.createElement('div'),
  stopEvent: false
});
sarimanah1.getElement().innerHTML = '<img src="img/marker.png" alt="Marker" style="width: 20px; height: 20px;">';
map.addOverlay(sarimanah1);


// Buat overlay untuk marker kedua
const sarimanah2 = new Overlay({
  position: fromLonLat([107.57674995307603 ,-6.879421693090783]), // Koordinat marker kedua
  positioning: 'center-center',
  element: document.createElement('div'),
  stopEvent: false
});
sarimanah2.getElement().innerHTML = '<img src="img/marker.png" alt="Marker" style="width: 20px; height: 20px;">';
map.addOverlay(sarimanah2);


// Buat overlay untuk marker ketiga
const ciwaruga = new Overlay({
  position: fromLonLat([107.57443704813844, -6.865543210439596]), // Koordinat marker ketiga
  positioning: 'center-center',
  element: document.createElement('div'),
  stopEvent: false
});
ciwaruga.getElement().innerHTML = '<img src="img/marker.png" alt="Marker" style="width: 20px; height: 20px;">';
map.addOverlay(ciwaruga);

// Perbaikan koordinat marker keempat
const sarijadi = new Overlay({
  position: fromLonLat([107.58023768006228,-6.8739512071239846]), // Koordinat marker keempat yang sudah diperbaiki
  positioning: 'center-center',
  element: document.createElement('div'),
  stopEvent: false
});
sarijadi.getElement().innerHTML = '<img src="img/marker.png" alt="Marker" style="width: 20px; height: 20px;">';
map.addOverlay(sarijadi);

// Perbaikan koordinat marker kelima
const yomartsarimanah = new Overlay({
  position: fromLonLat([107.57699001587744, -6.878240461265228]), // Koordinat marker keempat yang sudah diperbaiki
  positioning: 'center-center',
  element: document.createElement('div'),
  stopEvent: false
});
yomartsarimanah.getElement().innerHTML = '<img src="img/marker.png" alt="Marker" style="width: 20px; height: 20px;">';
map.addOverlay(yomartsarimanah);

// Perbaikan koordinat marker keenam
const alfacitereup = new Overlay({
  position: fromLonLat([107.55090379994242,-6.862020504462997]), // Koordinat marker keempat yang sudah diperbaiki
  positioning: 'center-center',
  element: document.createElement('div'),
  stopEvent: false
});
alfacitereup.getElement().innerHTML = '<img src="img/marker.png" alt="Marker" style="width: 20px; height: 20px;">';
map.addOverlay(alfacitereup);

// Perbaikan koordinat marker ketujuh
const indomaretWj = new Overlay({
  position: fromLonLat([107.57613168830173, -6.8620573920747585]), // Koordinat marker keempat yang sudah diperbaiki
  positioning: 'center-center',
  element: document.createElement('div'),
  stopEvent: false
});
indomaretWj.getElement().innerHTML = '<img src="img/marker.png" alt="Marker" style="width: 20px; height: 20px;">';
map.addOverlay(indomaretWj);


// Perbaikan koordinat marker kedelapan
const alfacijambe = new Overlay({
  position: fromLonLat([107.69155583045713, -6.900889681458682]), // Koordinat marker keempat yang sudah diperbaiki
  positioning: 'center-center',
  element: document.createElement('div'),
  stopEvent: false
});
alfacijambe.getElement().innerHTML = '<img src="img/marker.png" alt="Marker" style="width: 20px; height: 20px;">';
map.addOverlay(alfacijambe);

// Perbaikan koordinat marker kesembilan
const alfasarirasa = new Overlay({
  position: fromLonLat([107.57953758524604, -6.878177172346037]), // Koordinat marker keempat yang sudah diperbaiki
  positioning: 'center-center',
  element: document.createElement('div'),
  stopEvent: false
});
alfasarirasa.getElement().innerHTML = '<img src="img/marker.png" alt="Marker" style="width: 20px; height: 20px;">';
map.addOverlay(alfasarirasa);


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

sarimanah1.getElement().addEventListener('click', function() {
  const coordinate = sarimanah1.getPosition();
  const content = `
    <div style="background-color: white; padding: 10px;">
      <table>
        <tr>
          <th>Alfamart sarimanah</th>
          <td></td>
        </tr>
        <tr>
          <th>Jl. Sarimanah Kel No.87, RT.04/RW.09,<br>
           Sarijadi, Kec. Sukasari, Kota Bandung, 
           Jawa Barat 40151</th>
          <td></td>
        </tr>
      </table>
    </div>`;
  displayPopup(coordinate, content);
});

// Tambahkan event listener untuk marker kedua
sarimanah2.getElement().addEventListener('click', function() {
  const coordinate = sarimanah2.getPosition();
  const content = `
    <div style="background-color: white; padding: 10px;">
      <table>
        <tr>
          <th>Alfamart</th>
          <td></td>
        </tr>
        <tr>
          <th>Jl. Sarimanah Kel No.15, RT.06/RW.07, Sarijadi,<br>
           Kec. Sukasari, Kota Bandung, Jawa Barat 40151<td></td>
        </tr>
      </table>
    </div>`;
  displayPopup(coordinate, content);
});

// Tambahkan event listener untuk marker ketiga
ciwaruga.getElement().addEventListener('click', function() {
  const coordinate = ciwaruga.getPosition();
  const content = `
    <div style="background-color: white; padding: 10px;">
      <table>
        <tr>
          <th>Alfamart</th>
          <td></td>
        </tr>
        <tr>
          <th>Jl. Ciwaruga-Ters, Jl. Gegerkalong Hilir No.37, RT.01/RW.03,<br>
           Ciwaruga, Kec. Parongpong, Kabupaten Bandung Barat, Jawa Barat 40559</th>
          <td></td>
        </tr>
      </table>
    </div>`;
  displayPopup(coordinate, content);
});

// Tambahkan event listener untuk marker keempat
sarijadi.getElement().addEventListener('click', function() {
  const coordinate = sarijadi.getPosition();
  const content = `
    <div style="background-color: white; padding: 10px;">
      <table>
        <tr>
          <th>Alfamart</th>
          <td></td>
        </tr>
        <tr>
          <th>Jl. Sarijadi Raya No.50, Sukarasa,<br>
           Kec. Sukasari, Kota Bandung, Jawa Barat 40151</th>
          <td></td>
        </tr>
      </table>
    </div>`;
  displayPopup(coordinate, content);
});

// Tambahkan event listener untuk marker kelima
yomartsarimanah.getElement().addEventListener('click', function() {
  const coordinate = yomartsarimanah.getPosition();
  const content = `
    <div style="background-color: white; padding: 10px;">
      <table>
        <tr>
          <th>Yomart</th>
          <td></td>
        </tr>
        <tr>
          <th>Jl. Sarimanah No.106, Sarijadi,<br>
           Kec. Sukasari, Kota Bandung, Jawa Barat 40151</th>
          <td></td>
        </tr>
      </table>
    </div>`;
  displayPopup(coordinate, content);
});

// Tambahkan event listener untuk marker keenam
alfacitereup.getElement().addEventListener('click', function() {
  const coordinate = alfacitereup.getPosition();
  const content = `
    <div style="background-color: white; padding: 10px;">
      <table>
        <tr>
          <th>Alfamart</th>
          <td></td>
        </tr>
        <tr>
          <th>Jl. Citeureup Kel No.87, Citeureup,<br>
           Kec. Cimahi Utara, Kota Cimahi, Jawa Barat 40512</th>
          <td></td>
        </tr>
      </table>
    </div>`;
  displayPopup(coordinate, content);
});

// Tambahkan event listener untuk marker ketujuh
indomaretWj.getElement().addEventListener('click', function() {
  const coordinate = indomaretWj.getPosition();
  const content = `
    <div style="background-color: white; padding: 10px;">
      <table>
        <tr>
          <th>Indomaret</th>
          <td></td>
        </tr>
        <tr>
          <th>Jl Waruga Jaya, Ciwaruga, Kec. Parongpong,<br>
           Kota Bandung, Jawa Barat 40559</th>
          <td></td>
        </tr>
      </table>
    </div>`;
  displayPopup(coordinate, content);
});

// Tambahkan event listener untuk marker kedelapan
alfacijambe.getElement().addEventListener('click', function() {
  const coordinate = alfacijambe.getPosition();
  const content = `
    <div style="background-color: white; padding: 10px;">
      <table>
        <tr>
          <th>Alfamart</th>
          <td></td>
        </tr>
        <tr>
          <th>Jl. Kosar Perum Pesona Pasir Endah Rt. 08 Rw. 07 <br>
          Ds, Cigending, Kec. Ujung Berung, Kota Bandung, Jawa Barat 40611</th>
          <td></td>
        </tr>
      </table>
    </div>`;
  displayPopup(coordinate, content);
});

// Tambahkan event listener untuk marker kesembilan
alfasarirasa.getElement().addEventListener('click', function() {
  const coordinate = alfasarirasa.getPosition();
  const content = `
    <div style="background-color: white; padding: 10px;">
      <table>
        <tr>
          <th>Alfamart</th>
          <td></td>
        </tr>
        <tr>
          <th>Jl.Sarirasa Blok Iv No.80 Rt 02 Rw 03 ,<br>
           Kel, Sarijadi, Kec. Sukasari, Kota Bandung, Jawa Barat 40151</th>
          <td></td>
        </tr>
      </table>
    </div>`;
  displayPopup(coordinate, content);
});


// Tambahkan event listener untuk peta
map.on('click', function(event) {
  popup.setPosition(null);
});
