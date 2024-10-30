document.addEventListener('DOMContentLoaded', async () => {
    const dataDisplayTable = document.getElementById('dataDisplayTable').getElementsByTagName('tbody')[0];
    const totalLocElement = document.getElementById('totalLocations'); 

    fetch('https://asia-southeast2-backend-438507.cloudfunctions.net/parkirgratisbackend/data/saran')
        .then(response => response.json())
        .then(data => {
            let totalLocations = 0;
            data.forEach(item => {
                const row = dataDisplayTable.insertRow();

                // Gmail kolom
                let cell1 = row.insertCell(0);
                cell1.className = "px-10 py-4 whitespace-nowrap border-b border-gray-200";
                cell1.innerHTML = `<div class="text-sm text-gray-900">${item.gmail || 'No Gmail provided'}</div>`;

                // Nama kolom
                let cell2 = row.insertCell(1);
                cell2.className = "px-6 py-4 whitespace-nowrap border-b border-gray-200";
                cell2.innerHTML = `<div class="text-sm text-gray-900">${item.nama || 'No Name provided'}</div>`;

                // Saran kolom
                let cell3 = row.insertCell(2);
                cell3.className = "px-6 py-4 whitespace-nowrap border-b border-gray-200";
                cell3.innerHTML = `<div class="text-sm text-gray-900">${item.saran_user || 'No Feedback provided'}</div>`;

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
