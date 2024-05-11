import Overlay from 'https://cdn.skypack.dev/ol/Overlay.js';
import { fromLonLat } from 'https://cdn.skypack.dev/ol/proj.js';

export function createPopups(map, data) {
  return data.map(({ coordinate }) => {
    const popup = new Overlay({
      element: document.createElement('div'),
      autoPan: true,
      autoPanAnimation: { duration: 250 }
    });
    map.addOverlay(popup); // Menambahkan popup ke dalam map
    return popup;
  });
}

export function displayPopup(popup, coordinate, content) {
  popup.getElement().innerHTML = content;
  popup.setPosition(fromLonLat(coordinate));
  popup.setPositioning('bottom-center');
}
