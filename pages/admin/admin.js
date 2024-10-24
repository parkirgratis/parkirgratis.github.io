document.addEventListener('DOMContentLoaded', async () => {
    const dataDisplayTable = document.getElementById('dataDisplayTable').getElementsByTagName('tbody')[0];
    const totalLocElement = document.getElementById('totalLoc');

    fetch('https://asia-southeast2-backend-438507.cloudfunctions.net/parkirgratisbackend/data/lokasi')
        .then(response => response.json())
        .then(data => {
            let totalLocations = 0;
            data.forEach(item => {
                const row = dataDisplayTable.insertRow();
                
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
                cell3.innerHTML = `
                    <span class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                        ${item.fasilitas}
                    </span>`;

                let cell4 = row.insertCell(3);
                cell4.className = "px-6 py-4 whitespace-no-wrap border-b border-gray-200";
                cell4.innerHTML = `<img class="w-20 h-20" src="${item.gambar ? item.gambar : 'path/to/default/image.jpg'}" alt="Gambar">`;

                // Actions (Update/Delete Buttons) Column
                let cell5 = row.insertCell(4);
                cell5.className = "px-6 py-4 whitespace-no-wrap border-b border-gray-200";
                cell5.innerHTML = `
                                    <div class="flex space-x-2">
                                        <button type="button" class="text-white bg-green-500 px-2 py-1 rounded-md" onclick="showUpdateForm('${item._id}', '${item.nama_tempat}', '${item.lokasi}', '${item.fasilitas}', ${item.lon}, ${item.lat}, '${item.gambar}')">Update</button>
                                        <button type="button" class="text-white bg-red-500 px-2 py-1 rounded-md" onclick="deleteData('${item._id}', ${item.lon}, ${item.lat}, this)">Delete</button>
                                    </div>`;
                totalLocations++;
            });
            totalLocElement.innerHTML = totalLocations;
        })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
});