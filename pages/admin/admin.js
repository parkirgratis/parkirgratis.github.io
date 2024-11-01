import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import {addCSS} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";

addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

document.addEventListener('DOMContentLoaded', async () => {
    const dataDisplayTable = document.getElementById('dataDisplayTable').getElementsByTagName('tbody')[0];
    const totalLocElement = document.getElementById('totalLoc');
    const searchBar = document.getElementById('searchBar');
    const notificationDropdown = document.getElementById('notificationDropdown');

    fetch('https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/data/lokasi')
        .then(response => response.json())
        .then(data => {
            let totalLocations = 0;
            data.forEach(item => {
                const row = dataDisplayTable.insertRow();
                const facilities = item.fasilitas.split(' ').reduce((acc, word, index, arr) => {
                    if (word === "Tidak" && arr[index + 1] === "ada") {
                        acc.push(`<span class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full mr-1">Tidak ada</span>`);
                        arr.splice(index + 1, 1);
                    } else if (word !== "ada") {
                        acc.push(`<span class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full mr-1">${word}</span>`);
                    }
                    return acc;
                }, []).join('');
                
                // Name Column
                let cell1 = row.insertCell(0);
                cell1.className = "px-6 py-4 whitespace-no-wrap border-b border-gray-200";
                cell1.innerHTML = `<div class="flex items-center">
                                    <div class="ml-4">
                                        <div class="text-sm font-medium leading-5 text-gray-900">${item.nama_tempat}</div>
                                        <div class="md:block hidden text-sm leading-5 text-gray-500">${item.lokasi}</div>
                                    </div>
                                </div>`;
                
                // Title (Lokasi) Column
                let cell2 = row.insertCell(1);
                cell2.className = "px-6 py-4 whitespace-no-wrap border-b border-gray-200";
                cell2.innerHTML = `<div class="text-sm leading-5 text-gray-900">${item.lon}, ${item.lat}</div>`;

                // Status (Fasilitas) Column
                let cell3 = row.insertCell(2);
                cell3.className = "px-6 py-4 whitespace-no-wrap border-b border-gray-200";
                cell3.innerHTML = facilities;

                let cell4 = row.insertCell(3);
                cell4.className = "px-6 py-4 whitespace-no-wrap border-b border-gray-200";
                cell4.innerHTML = `<img class="w-20 h-20" src="${item.gambar ? item.gambar : 'path/to/default/image.jpg'}" alt="Gambar">`;

                // Actions (Update/Delete Buttons) Column
                let cell5 = row.insertCell(4);
                cell5.className = "px-6 py-4 whitespace-no-wrap border-b border-gray-200";
                cell5.innerHTML = `<div class="flex space-x-2">
                                        <button type="button" class="text-white bg-green-500 px-2 py-1 rounded-md" onclick="showUpdateForm('${item._id}', '${item.nama_tempat}', '${item.lokasi}', '${item.fasilitas}', ${item.lon}, ${item.lat}, '${item.gambar}')">Update</button>
                                        <button type="button" class="text-white bg-red-500 px-2 py-1 rounded-md" onclick="deleteData('${item._id}', ${item.lon}, ${item.lat})">Delete</button>
                                    </div>`;
                totalLocations++;
            });
            totalLocElement.innerHTML = totalLocations;
        })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
    searchBar.addEventListener('input', () => {
        const searchTerm = searchBar.value.toLowerCase();
        const rows = dataDisplayTable.getElementsByTagName('tr');

        Array.from(rows).forEach(row => {
            const locationName = row.cells[0].innerText.toLowerCase(); // Adjust index for search column
            const coordinates = row.cells[1].innerText.toLowerCase();
            
            if (locationName.includes(searchTerm) || coordinates.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    try {
        const response = await fetch('https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/data/lokasi');
        const data = await response.json();
        console.log(data);
        
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
        console.error('Error fetching notifications:', error);
    }
});

window.deleteData = function(id, lon, lat) {
    const token = localStorage.getItem('token');
    Swal.fire({
        title: 'Are you sure?',
        text: "Delete data with ID " + id + "?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (!result.isConfirmed) return;

        console.log(`Deleting item with ID: ${id}`);

        fetch('https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/data/tempat', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ id: id })
        })
        .then(async response => {
            let data;
            try {
                data = await response.json();
            } catch (error) {
                console.error('Response is not JSON:', error);
                throw new Error('Invalid JSON response');
            }
            return { status: response.status, body: data };
        })
        .then(({ status, body }) => {
            if (status === 200) {
                fetch('https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/data/koordinat', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        id: id,
                        lon: lon,
                        lat: lat
                    })
                })
                .then(async response => {
                    let data;
                    try {
                        data = await response.json();
                    } catch (error) {
                        console.error('Response is not JSON:', error);
                        throw new Error('Invalid JSON response');
                    }
                    return data;
                })
                .then(data => {
                    Swal.fire('Deleted!', 'Coordinates deleted successfully!', 'success');
                    location.reload();
                })
                .catch(error => {
                    console.error('Error deleting coordinates:', error);
                    Swal.fire('Error', 'Failed to delete coordinates!', 'error');
                });
            } else {
                console.error('Failed to delete the main data:', body);
                Swal.fire('Error', 'Failed to delete the main data!', 'error');
            }
        })
        .catch(error => {
            console.error('Error deleting main data:', error);
            Swal.fire('Error', 'An error occurred while deleting the main data!', 'error');
        });
    });
};