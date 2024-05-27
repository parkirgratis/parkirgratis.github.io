import Overlay from 'https://cdn.skypack.dev/ol/Overlay.js';//mnambah elemen di atas peta, seperti marker atau popup.
import { fromLonLat } from 'https://cdn.skypack.dev/ol/proj.js';//menkonversi koordinat

export function createMarker(map, coordinates) {//Ini mendefinisikan fungsi createMarker yang menerima dua argumen: map (peta OpenLayers) dan coordinates (koordinat latitude dan longitude).


  const marker = new Overlay({//membuat var marker lalu membuat overlay baru
    position: fromLonLat(coordinates),//menentukan posisi sesuai koordinat
    positioning: 'center-center', //overlay akan di posisikan di tengah
    element: createMarkerElement(), //Element DOM yang akan digunakan sebagai isi dari marker. Fungsi createMarkerElement digunakan untuk membuat elemen ini.
    stopEvent: false //ini agar klik peta tidak dihentikan 
  });
  map.addOverlay(marker); //overlay marker di tambahkan ke peta 
  return marker; //untuk mengembalikan objek overlay marker
}

function createMarkerElement() {//ini mendefinisika fungsi createMarkerElement untuk marker dan 
  const element = document.createElement('div');
  element.innerHTML = '<img src="img/marker.png" alt="Marker" style="width: 20px; height: 20px;">';
  return element;
}
