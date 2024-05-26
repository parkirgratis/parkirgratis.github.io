import { isiTabel } from "../temp/table.js";

export function isiTable(results) {
    clearTable();
    console.log(results);
    results.forEach(isiRow);
}

function isiRow(value) {
    let content = 
    isiTabel.replace("ID", value._id)
            .replace("Nama", value.nama_tempat)
            .replace("Lokasi", value.lokasi)
            .replace("Fasilitas", value.fasilitas)
            .replace("Lon", value.lon);
           
    const tableBody = document.querySelector('#iniTabel tbody');
    if (tableBody) {
        let newRow = document.createElement('tr');
        newRow.innerHTML = content;
        tableBody.appendChild(newRow); 
    }
}

function clearTable() {
    const tableBody = document.querySelector('#iniTabel tbody');
    if (tableBody) {
        tableBody.innerHTML = ''; 
    }
}
