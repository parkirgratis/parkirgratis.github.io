import Map from 'https://cdn.skypack.dev/ol/Map.js';
import View from 'https://cdn.skypack.dev/ol/View.js';
import TileLayer from 'https://cdn.skypack.dev/ol/layer/Tile.js';
import OSM from 'https://cdn.skypack.dev/ol/source/OSM.js';
import { fromLonLat, toLonLat } from 'https://cdn.skypack.dev/ol/proj.js';
import Overlay from 'https://cdn.skypack.dev/ol/Overlay.js';

// Initialize the map
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
    element.innerHTML = '<img src="https://png.pngtree.com/png-vector/20230106/ourmid/pngtree-flat-red-location-sign-png-image_6553065.png" alt="Marker" style="width: 20px; height: 20px;">';

    return element;
}


map.on('click', (event) => {

    const coordinates = toLonLat(event.coordinate);
    const longitude = coordinates[0];
    const latitude = coordinates[1];


    document.getElementById('long').value = longitude.toFixed(6);
    document.getElementById('lat').value = latitude.toFixed(6);

    createMarker(map, coordinates);
});
