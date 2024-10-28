document.addEventListener('DOMContentLoaded', async () => {
    const dataDisplayTable = document.getElementById('dataDisplayTable').getElementsByTagName('tbody')[0];
    const totalLocElement = document.getElementById('totalLocations'); // Add this to display total locations if needed

    fetch('https://asia-southeast2-backend-438507.cloudfunctions.net/parkirgratisbackend/data/saran')
        .then(response => response.json())
        .then(data => {
            let totalLocations = 0;
            data.forEach(item => {
                const row = dataDisplayTable.insertRow();

                // Gmail Column
                let cell1 = row.insertCell(0);
                cell1.className = "px-6 py-4 whitespace-no-wrap border-b border-gray-200";
                cell1.innerHTML = `<div class="flex items-center">
                                        <div class="ml-4">
                                            <div class="md:block hidden text-sm leading-5 text-gray-500">${item.gmail}</div>
                                        </div>
                                   </div>`;

                // Nama Column
                let cell2 = row.insertCell(1);
                cell2.className = "px-6 py-4 whitespace-no-wrap border-b border-gray-200";
                cell2.innerHTML = `<div class="flex items-center">
                                       <div class="ml-4">
                                           <div class="md:block hidden text-sm leading-5 text-gray-500">${item.nama}</div>
                                       </div>
                                   </div>`;

                // Saran Column
                let cell3 = row.insertCell(2);
                cell3.className = "px-6 py-4 whitespace-no-wrap border-b border-gray-200";
                cell3.innerHTML = `<div class="flex items-center">
                                       <div class="ml-4">
                                           <div class="md:block hidden text-sm leading-5 text-gray-500">${item.saran_user}</div>
                                       </div>
                                   </div>`;

                totalLocations++;
            });
            
            if (totalLocElement) {
                totalLocElement.innerHTML = totalLocations;
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});
