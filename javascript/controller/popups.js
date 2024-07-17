import Overlay from 'https://cdn.skypack.dev/ol/Overlay.js';
import { fromLonLat } from 'https://cdn.skypack.dev/ol/proj.js';

export function createPopups(map, data) {
  return data.map(({ coordinate }) => {
    const popupElement = document.createElement('div');
    const popup = new Overlay({
      element: popupElement,
      autoPan: true,
      autoPanAnimation: { duration: 250 }
    });
    map.addOverlay(popup);
    return { popup, popupElement };
  });
}

export function displayPopup(popup, coordinate, content) {
  popup.getElement().innerHTML = content;
  popup.setPosition(fromLonLat(coordinate));
  popup.setPositioning('bottom-center');
}