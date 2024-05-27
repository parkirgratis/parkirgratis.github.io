import Map from 'https://cdn.skypack.dev/ol/Map.js';//untuk memunculkan map dari skypack
import View from 'https://cdn.skypack.dev/ol/View.js';//untuk menampilkan map dari skypack
import TileLayer from 'https://cdn.skypack.dev/ol/layer/Tile.js';//untuk menampilakan layer pada map
import OSM from 'https://cdn.skypack.dev/ol/source/OSM.js';//emggunakan peta open street map

import { fromLonLat } from 'https://cdn.skypack.dev/ol/proj.js';//untuk konversi koordinat 
import { createMarker } from './controller/markers.js';//untuk menampilkan marker pada map
import { createPopups, displayPopup } from './controller/popups.js';//untuk membuat dan memunculkan popup

const map = new Map({
    target: 'map',//id div dari html
    layers: [
        new TileLayer({
            source: new OSM()
        })
    ],
    view: new View({
        center: fromLonLat([107.6098, -6.9175]),//untuk menentukan koordinat
        zoom: 12 //untuk memperbesar pada map
    })
});

const markerCoords = [
    [107.57806170827054, -6.87616450819235],//alfamart sarimanah
    [107.57441932515601, -6.865637836144359],//alfamart ciwaruga Jl. Ciwaruga-Ters, Jl. Gegerkalong Hilir No.37, RT.01/RW.03, Ciwaruga, Kec. Parongpong, Kabupaten Bandung Barat, Jawa Barat 40559
    [107.58023768006228, -6.8739512071239846],//yomart Sarimanah Jl. Sarimanah No.106, Sarijadi, Kec. Sukasari, Kota Bandung, Jawa Barat 40151
    [107.55091369885083, -6.8622383054487806],//alfamart Jl. Citeureup Kel No.87, Citeureup, Kec. Cimahi Utara, Kota Cimahi, Jawa Barat 40512
    [107.57613168830173, -6.8620573920747585],//indomaret warugajaya 4HQG+5C6, Jalan Waruga Jaya, Ciwaruga, Kec. Parongpong, Kota Bandung, Jawa Barat 40559
    [ 107.6916921488174, -6.901263021760781],//yomart jalan kosar Jl. Simpay Asih, Pasir Endah, Kec. Ujung Berung, Kota Bandung, Jawa Barat 40619
];

const popupsData = [
    {
        coordinate: markerCoords[0],
        content: `<tbody>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg" id="iniTabel">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <tr>
        <th scope="col" class="px-6 py-3">
         #
        </th>
        <th scope="col" class="px-6 py-3">
            #
        </th>
        <th scope="col" class="px-6 py-3">
            #
        </th>
        <th scope="col" class="px-6 py-3">
            #
        </th>
                </table>
            </div> </tbody>`
    },
   
    // Add other popup data here
];

const markers = markerCoords.map(coord => createMarker(map, coord));
const popups = createPopups(map, popupsData);

markers.forEach((marker, index) => {
    marker.getElement().addEventListener('click', () => {
        const popup = popups[index];
        displayPopup(popup, popupsData[index].coordinate, popupsData[index].content);
    });
});

map.on('click', function(event) {
    popups.forEach(popup => {
        popup.setPosition(null);
    });
});
