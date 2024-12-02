document.addEventListener('DOMContentLoaded', async () => {
    const dataDisplayTable = document.getElementById('dataDisplayTable').getElementsByTagName('tbody')[0];
    const totalLocElement = document.getElementById('totalLocations'); 

    fetch('https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/data/saran')
        .then(response => response.json())
        .then(data => {
            let totalLocations = 0;
            data.forEach(item => {
                const row = dataDisplayTable.insertRow();

                // Nama kolom
                let cell1 = row.insertCell(0);
                cell1.className = "px-6 py-4 border-b border-gray-200";
                cell1.innerHTML = `<div class="text-sm text-gray-900">${item.nama || 'No Name provided'}</div>`;

                // Gmail kolom
                let cell2 = row.insertCell(1);
                cell2.className = "px-6 py-4 border-b border-gray-200";
                cell2.innerHTML = `<div class="text-sm text-gray-900">${item.gmail || 'No Gmail provided'}</div>`;

                // Saran kolom
                let cell3 = row.insertCell(2);
                cell3.className = "px-6 py-4 border-b border-gray-200 min-w-[400px]";
                cell3.innerHTML = `<div class="text-sm text-gray-900">${item.saran_user || 'No Feedback provided'}</div>`;

                // Tanggal kolom
                let cell4 = row.insertCell(3);
                cell4.className = "px-6 py-4 border-b border-gray-200 min-w-[200px]";  // Adjusted width
                const date = item.tanggal ? new Date(item.tanggal) : null;
                const formattedDate = date && !isNaN(date.getTime()) 
                    ? date.toLocaleDateString('id-ID')  // Format tanggal ke format Indonesia (dd/mm/yyyy)
                    : 'No Date provided';  // Tanggal kosong
                cell4.innerHTML = `<div class="text-sm text-gray-900">${formattedDate}</div>`;

                totalLocations++;
            });

            // Display total number of locations (feedback entries)
            if (totalLocElement) {
                totalLocElement.innerHTML = totalLocations;
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});
