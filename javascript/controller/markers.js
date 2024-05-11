import Overlay from 'https://cdn.skypack.dev/ol/Overlay.js';
import { fromLonLat } from 'https://cdn.skypack.dev/ol/proj.js';

export function createMarker(map, coordinates) {
  const marker = new Overlay({
    position: fromLonLat(coordinates),
    positioning: 'center-center',
    element: createMarkerElement(),
    stopEvent: false
  });
  map.addOverlay(marker);
  return marker;
}

function createMarkerElement() {
  const element = document.createElement('div');
  element.innerHTML = '<img src="img/marker.png" alt="Marker" style="width: 20px; height: 20px;">';
  return element;
}
