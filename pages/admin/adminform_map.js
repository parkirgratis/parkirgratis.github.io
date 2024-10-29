import Map from 'https://cdn.skypack.dev/ol/Map.js';
import View from 'https://cdn.skypack.dev/ol/View.js';
import TileLayer from 'https://cdn.skypack.dev/ol/layer/Tile.js';
import OSM from 'https://cdn.skypack.dev/ol/source/OSM.js';
import { fromLonLat, toLonLat } from 'https://cdn.skypack.dev/ol/proj.js';
import { fromEvent } from 'https://cdn.skypack.dev/rxjs';

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

// tambah saat klik map
map.on('click', (event) => {
    // mendapatkan lon lat saat mengklik map
    const coordinates = toLonLat(event.coordinate);
    const longitude = coordinates[0];
    const latitude = coordinates[1];

    
    document.getElementById('long').value = longitude.toFixed(6); 
    document.getElementById('lat').value = latitude.toFixed(6); 
});
