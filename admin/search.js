
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchQuery');
    const dataDisplayTable = document.getElementById('dataDisplayTable');
    const tableBody = dataDisplayTable.querySelector('tbody');

    
    const data = [
        { namaTempat: 'Tempat Parkir A', lokasi: 'Bandung Utara', fasilitas: 'CCTV, Toilet', koordinat: '-6.9175,107.6191', gambar: 'img1.jpg' },
        { namaTempat: 'Tempat Parkir B', lokasi: 'Bandung Barat', fasilitas: 'Rest Area', koordinat: '-6.9333,107.6050', gambar: 'img2.jpg' },
        { namaTempat: 'Tempat Parkir C', lokasi: 'Bandung Selatan', fasilitas: 'Tempat Makan, Wifi', koordinat: '-6.9400,107.6212', gambar: 'img3.jpg' }
    ];

    
    const renderTableRows = (filteredData) => {
        tableBody.innerHTML = '';  
        filteredData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.namaTempat}</td>
                <td>${item.lokasi}</td>
                <td>${item.fasilitas}</td>
                <td>${item.koordinat}</td>
                <td><img src="${item.gambar}" alt="${item.namaTempat}" width="50"></td>
                <td><button class="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-700">Edit</button></td>
            `;
            tableBody.appendChild(row);
        });
    };

    
    renderTableRows(data);

    
    const filterTableData = (query) => {
        const filteredData = data.filter(item => {
            const searchTerm = query.toLowerCase();
            return (
                item.namaTempat.toLowerCase().includes(searchTerm) ||
                item.lokasi.toLowerCase().includes(searchTerm)
            );
        });
        renderTableRows(filteredData);
    };

    
    searchInput.addEventListener('input', (event) => {
        const query = event.target.value;
        filterTableData(query);  
    });
});
