import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { addCSS } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";
import {
    setInner,
    show,
    hide,
    getValue,
    getFileSize
  } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.0.6/croot.js";

addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

document.addEventListener('DOMContentLoaded', async () => {
    const dataDisplayTable = document.getElementById('dataDisplayTable').getElementsByTagName('tbody')[0];
    const totalLocElement = document.getElementById('totalLoc');
    const searchBar = document.getElementById('searchBar');
    const notificationDropdown = document.getElementById('notificationDropdown');

    try {
        const response = await fetch('https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/data/lokasi');
        const data = await response.json();
        
        let totalLocations = 0;
        data.forEach(item => {
            const row = dataDisplayTable.insertRow();
            const facilities = item.fasilitas.split(' ').map(word => {
                if (word === "Tidak") return '<span class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full mr-1">Tidak ada</span>';
                if (word !== "ada") return `<span class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full mr-1">${word}</span>`;
            }).join('');

            // Populate the table row
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <div class="flex items-center">
                        <div class="ml-4">
                            <div class="text-sm font-medium leading-5 text-gray-900">${item.nama_tempat}</div>
                            <div class="md:block hidden text-sm leading-5 text-gray-500">${item.lokasi}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <div class="text-sm leading-5 text-gray-900">${item.lon}, ${item.lat}</div>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">${facilities}</td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <img class="w-20 h-20" src="${item.gambar || 'path/to/default/image.jpg'}" alt="Gambar">
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <div class="flex space-x-2">
                        <button type="button" class="text-white bg-green-500 px-2 py-1 rounded-md" onclick="showUpdateForm('${item._id}', '${item.nama_tempat}', '${item.lokasi}', '${item.fasilitas}', ${item.lon}, ${item.lat}, '${item.gambar}')">Update</button>
                        <button type="button" class="text-white bg-red-500 px-2 py-1 rounded-md" onclick="deleteData('${item._id}', ${item.lon}, ${item.lat})">Delete</button>
                    </div>
                </td>
            `;
            totalLocations++;
        });
        totalLocElement.textContent = totalLocations;

        // Populate latest notifications
        const latestData = data.slice(-5).reverse();
        latestData.forEach(item => {
            const notificationItem = document.createElement('a');
            notificationItem.href = "#";
            notificationItem.className = "flex items-center px-4 py-3 -mx-2 text-gray-600 hover:text-white hover:bg-indigo-600";
            notificationItem.innerHTML = `
                <img class="object-cover w-8 h-8 mx-1 rounded-full" src="${item.gambar || 'default-avatar.jpg'}" alt="avatar">
                <p class="mx-2 text-sm">
                    <span class="font-semibold">Lokasi baru telah ditambahkan</span> - <span class="text-indigo-400 font-bold">${item.nama_tempat}</span>
                </p>`;
            notificationDropdown.appendChild(notificationItem);
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('Error', 'Failed to load location data.', 'error');
    }

    searchBar.addEventListener('input', () => {
        const searchTerm = searchBar.value.toLowerCase();
        const rows = dataDisplayTable.getElementsByTagName('tr');

        Array.from(rows).forEach(row => {
            const locationName = row.cells[0].innerText.toLowerCase();
            const coordinates = row.cells[1].innerText.toLowerCase();
            
            row.style.display = locationName.includes(searchTerm) || coordinates.includes(searchTerm) ? '' : 'none';
        });
    });
});

window.deleteData = async function(id, lon, lat) {
    const token = localStorage.getItem('token');
    try {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Delete data with ID ${id}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (!result.isConfirmed) return;

        const response = await fetch('https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/data/tempat', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id })
        });

        if (!response.ok) throw new Error('Failed to delete main data');

        await fetch('https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/data/koordinat', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, lon, lat })
        });

        Swal.fire('Deleted!', 'Data deleted successfully!', 'success');
        location.reload();
    } catch (error) {
        console.error('Error deleting data:', error);
        Swal.fire('Error', 'An error occurred while deleting data!', 'error');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.showUpdateForm = function (id, namaTempat, lokasi, fasilitas, lon, lat, gambar) {
        document.getElementById('updateId').value = id || '';
        document.getElementById('updateNamaTempat').value = namaTempat || '';
        document.getElementById('updateLokasi').value = lokasi || '';
        document.getElementById('updateFasilitas').value = fasilitas || '';
        document.getElementById('updateLon').value = lon || '';
        document.getElementById('updateLat').value = lat || '';
        document.getElementById('updateGambar').value = "";

        document.getElementById('updateFormContainer').classList.remove('hidden');
    };

    window.closeUpdateForm = function () {
        document.getElementById('updateFormContainer').classList.add('hidden');
    };

    const updateForm = document.getElementById('updateForm');
    if (updateForm) {
        updateForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            uploadImage();
            
            const id = document.getElementById('updateId').value;
            const namaTempat = document.getElementById('updateNamaTempat').value;
            const lokasi = document.getElementById('updateLokasi').value;
            const fasilitas = document.getElementById('updateFasilitas').value;
            const lon = parseFloat(document.getElementById('updateLon').value);
            const lat = parseFloat(document.getElementById('updateLat').value);
            const gambar = document.getElementById('updateGambar').value;

            if (!id || !namaTempat || !lokasi || !fasilitas || isNaN(lon) || isNaN(lat)) {
                alert('Semua kolom harus diisi dengan benar!');
                return;
            }

            const url = 'https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/data/tempat';

            const data = {
                "_id": id,
                "nama_tempat": namaTempat,
                "lokasi": lokasi,
                "fasilitas": fasilitas,
                "lon": lon,
                "lat": lat,
                "gambar": gambar || ""
            };

            try {
                const response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
                }

                const responseData = await response.json();
                console.log("Response data dari server:", responseData);
                Swal.fire({
                    icon: "success",
                    title: "Berhasil memperbarui data",
                    text: "Data parkir ini telah berhasil diperbarui.",
                    timer: 2000,
                });
                setTimeout(() => {
                    closeUpdateForm();
                    location.reload();
                }, 2000);

            } catch (error) {
                console.error('Error updating data:', error);
                Swal.fire({
                    icon: "error",
                    title: "Gagal Memperbarui Data",
                    text: "Data gagal diperbarui, silakan coba lagi.",
                });
            }
        });
    }
});

    window.uploadImage = uploadImage;

    const target_url = "https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/upload/img";

    function uploadImage() {
        const imageInput = document.getElementById('updateGambar');
        if (!imageInput || imageInput.files.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Silakan pilih file gambar terlebih dahulu"
            });
            return;
        }
        const inputFileElement = document.getElementById('updateGambar');
        if (inputFileElement) {
            hide("updateGambar");
        } else {
            console.error("Element with ID 'imageInputSidebar' not found");
        }
        let besar = getFileSize("updateGambar");
        setInner("isi", besar);
        
        postFile(target_url, "updateGambar", "img", renderToHtml);
    }

    function renderToHtml(result) {
        console.log(result);
        setInner("isi", "https://parkirgratis.github.io/filegambar/" + result.response);
        show("updateGambar");
    }

document.addEventListener('DOMContentLoaded', async () => {
    const dataDisplayWarung = document.getElementById('dataDisplayWarung').getElementsByTagName('tbody')[0];
    const totalWarungElement = document.getElementById('totalLocWarung');

    try {
        const response = await fetch('https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/data/warung');
        const data = await response.json();
        console.log("API Response Data:", data);
        
        let totalLocationWarung = 0;
        data.forEach(item => {
            const paymentMethods = (item.metode_pembayaran || []).map(method => {
                return `<span class="inline-flex px-2 text-xs font-semibold leading-5 text-blue-800 bg-blue-100 rounded-full mr-1">${method}</span>`;
            }).join('');

            const row = dataDisplayWarung.insertRow();

            row.innerHTML = `
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <div class="flex items-center">
                        <div class="ml-4">
                            <div class="text-sm font-medium leading-5 text-gray-900">${item.nama_tempat}</div>
                            <div class="md:block hidden text-sm leading-5 text-gray-500">${item.lokasi}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <div class="text-sm leading-5 text-gray-900">${item.lon}, ${item.lat}</div>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <div class="text-sm leading-5 text-gray-900">${item.jam_buka}</div>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <div>${paymentMethods || '<span class="inline-flex px-2 text-xs font-semibold leading-5 text-red-800 bg-red-100 rounded-full">Tidak tersedia</span>'}</div>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <img class="w-20 h-20" src="${item.gambar || 'https://www.freeiconspng.com/img/23494'}" alt="Gambar">
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <div class="flex space-x-2">
                        <button type="button" class="text-white bg-green-500 px-2 py-1 rounded-md" 
                            onclick="showUpdateFormWarung('${item._id}', '${item.nama_tempat}', '${item.lokasi}', '${item.jam_buka}', '${item.metode_pembayaran}', ${item.lon}, ${item.lat}, '${item.gambar}')">
                            Update
                        </button>
                        <button type="button" class="text-white bg-red-500 px-2 py-1 rounded-md" 
                            onclick="deleteData('${item._id}', ${item.lon}, ${item.lat})">
                            Delete
                        </button>
                    </div>
                </td>
            `;
            totalLocationWarung++;
        });
        totalWarungElement.textContent = totalLocationWarung;
    } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('Error', 'Failed to load location data.', 'error');
    }
    searchWarung.addEventListener('input', () => {
        const searchTerm = searchWarung.value.toLowerCase();
        const rows = dataDisplayWarung.getElementsByTagName('tr');

        Array.from(rows).forEach(row => {
            const locationName = row.cells[0].innerText.toLowerCase();
            const coordinates = row.cells[1].innerText.toLowerCase();
            
            row.style.display = locationName.includes(searchTerm) || coordinates.includes(searchTerm) ? '' : 'none';
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    window.showUpdateFormWarung = function (_id, namaTempat, lokasi, jamBuka, metodePembayaran, lon, lat, gambar) {
        console.log("showUpdateFormWarung called with id:", _id);
        console.log({
            _id, namaTempat, lokasi, jamBuka, metodePembayaran, lon, lat, gambar
        });            
        document.getElementById('updateIdWarung').value = _id || '';
        document.getElementById('updateNamaTempatWarung').value = namaTempat || '';
        document.getElementById('updateLokasiWarung').value = lokasi || '';
        document.getElementById('updateJamBukaWarung').value = jamBuka || '';
        document.getElementById('updateMetodePembayaranWarung').value = metodePembayaran || '';
        document.getElementById('updateLonWarung').value = lon || '';
        document.getElementById('updateLatWarung').value = lat || '';
        document.getElementById('updateFotoPratinjauWarung').value = gambar || '';
    
        console.log("Form fields populated:", {
            _id,
            namaTempat,
            lokasi,
            jamBuka,
            metodePembayaran,
            lon,
            lat,
            gambar
        });
    
        document.getElementById('updateFormContainerWarung').classList.remove('hidden');
    };    

    window.closeUpdateFormWarung = function () {
        document.getElementById('updateFormContainerWarung').classList.add('hidden');
    };

    const updateFormWarung = document.getElementById('updateFormWarung');
    if (updateFormWarung) {
        updateFormWarung.addEventListener('submit', async (e) => {
            e.preventDefault();
        
            const _id = document.getElementById('updateIdWarung').value;
            const namaTempat = document.getElementById('updateNamaTempatWarung').value;
            const lokasi = document.getElementById('updateLokasiWarung').value;
            const jam_buka = document.getElementById('updateJamBukaWarung').value;
            const metodePembayaran = document
                .getElementById('updateMetodePembayaranWarung')
                .value.split(',')
                .map(item => item.trim())
                .filter(item => item !== '');
            const lon = parseFloat(document.getElementById('updateLonWarung').value);
            const lat = parseFloat(document.getElementById('updateLatWarung').value);
            const gambar = document.getElementById('updateFotoPratinjauWarung').value;
        
            if (!_id || !namaTempat || !lokasi || !jam_buka || isNaN(lon) || isNaN(lat)) {
                Swal.fire('Error', 'All fields must be filled correctly!', 'error');
                return;
            }
        
            const url = 'https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/data/warung';
            const data = {
                "_id": _id,
                "nama_tempat": namaTempat,
                "lokasi": lokasi,
                "jam_buka": jam_buka,
                "metode_pembayaran": metodePembayaran,
                "lon": lon,
                "lat": lat,
                "gambar": gambar,
            };
        
            console.log("Data sent to server:", data);
        
            try {
                const response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
        
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
                }
        
                const responseData = await response.json();
                console.log("Response data from server:", responseData);
                Swal.fire({
                    icon: "success",
                    title: "Berhasil memperbarui data",
                    text: "Data warung telah berhasil diupdate",
                    timer: 2000,
                });
        
                setTimeout(() => {
                    closeUpdateFormWarung();
                    location.reload();
                }, 2000);
        
            } catch (error) {
                console.error('Error updating warung data:', error);
                Swal.fire({
                    icon: "error",
                    title: "Failed to Update Data",
                    text: "Failed to update data, please try again.",
                });
            }
        });        
    }
});

