import Map from 'https://cdn.skypack.dev/ol/Map.js';
import View from 'https://cdn.skypack.dev/ol/View.js';
import TileLayer from 'https://cdn.skypack.dev/ol/layer/Tile.js';
import OSM from 'https://cdn.skypack.dev/ol/source/OSM.js';
import Overlay from 'https://cdn.skypack.dev/ol/Overlay.js';
import { fromLonLat } from 'https://cdn.skypack.dev/ol/proj.js';
import { createMarker } from './markers.js';
import { createPopups, displayPopup } from './popups.js';

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

const markerCoords = [
  [107.57806170827054, -6.87616450819235],
  [107.57699001587744, -6.878240461265228],
  [107.57443704813844, -6.865543210439596],
  [107.58023768006228, -6.8739512071239846],
  [107.57674995307603, -6.879421693090783],
  [107.55090379994242, -6.862020504462997],
  [107.57613168830173, -6.8620573920747585],
  [107.69155583045713, -6.900889681458682]
];

markerCoords.forEach((coord, index) => {
  const marker = createMarker(map, coord);
  map.addOverlay(marker);

  marker.getElement().addEventListener('click', () => {
    const popup = popups[index];
    if (!map.getOverlayById(popup.getId())) {
      map.addOverlay(popup);
    }
    const coordinate = popup.getPosition();
    const content = popupsData[index].content;
    displayPopup(popup, coordinate, content);
  });
});

const popupsData = [
  {
    coordinate: markerCoords[1],
    content: `
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
      </div>`
  },
  // Add other popup data here
];

markerCoords.forEach((coord, index) => {
    const marker = createMarker(map, coord);
    map.addOverlay(marker);
  
    marker.getElement().addEventListener('click', () => {
      const popup = popups[index];
      if (!map.getOverlayById(popup.getId())) {
        map.addOverlay(popup);
      }
      const coordinate = popup.getPosition();
      const content = popupsData[index].content;
      displayPopup(popup, coordinate, content);
    });
  });
  
const popups = createPopups(map, popupsData);

popups.forEach((popup, index) => {
  const popupElement = popup.getElement();
  document.body.appendChild(popupElement); // Menambahkan elemen popup ke dalam DOM
  popupElement.addEventListener('click', () => {
    const coordinate = popupsData[index].coordinate; // Mengambil koordinat dari popupsData
    const content = popupsData[index].content;
    displayPopup(popup, coordinate, content); // Menyediakan popup sebagai parameter pertama
  });
});

map.on('click', function(event) {
  popups.forEach(popup => {
    popup.setPosition(null);
  });
});
