document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('You need to log in first');
        window.location.href = '../login.html'; 
        return;
    }

    try {
        const response = await fetch('https://asia-southeast2-backend-438507.cloudfunctions.net/parkirgratisbackend/admin/admin', { 
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        const data = await response.json();

        if (response.status === 200) {
            if (!localStorage.getItem('alertShown')) {
                alert('Dashboard access successful\nMessage: ' + data.message + '\nAdmin id: ' + data.admin_id);
                localStorage.setItem('alertShown', 'true');
            }

            // Memuat data lokasi jika login berhasil
            const dataDisplayTable = document.getElementById('dataDisplayTable').getElementsByTagName('tbody')[0];

            fetch('https://asia-southeast2-backend-438507.cloudfunctions.net/parkirgratisbackend/data/lokasi')
                .then(response => response.json())
                .then(data => {
                    data.forEach(item => {
                        const row = dataDisplayTable.insertRow();
                        row.insertCell(0).textContent = item.nama_tempat;
                        row.insertCell(1).textContent = item.lokasi;
                        row.insertCell(2).textContent = item.fasilitas;
                        row.insertCell(3).textContent = `${item.lon}, ${item.lat}`;

                        const gambarUrl = item.gambar ? item.gambar : 'path/to/default/image.jpg';
                        row.insertCell(4).innerHTML = `<img src="${gambarUrl}" alt="Gambar" style="width:100px;">`;

                        const actionsCell = row.insertCell(5);
                        actionsCell.innerHTML = `
                            <button type="button" style="background-color: #2ecc71;" onclick="showUpdateForm('${item._id}', '${item.nama_tempat}', '${item.lokasi}', '${item.fasilitas}', ${item.lon}, ${item.lat}, '${gambarUrl}')">Update</button>
                            <button type="button" style="background-color: #e74c3c;" onclick="deleteData('${item._id}', ${item.lon}, ${item.lat}, this)">Delete</button>
                        `;
                    });
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });

            const modal = document.getElementById('updateModal');
            const span = document.getElementsByClassName('close')[0];
            span.onclick = function () {
                modal.style.display = 'none';
            }
            window.onclick = function (event) {
                if (event.target == modal) {
                    modal.style.display = 'none';
                }
            }

            document.getElementById('updateForm').addEventListener('submit', function (event) {
                event.preventDefault();

                const id = document.getElementById('updateId').value;
                const updatedData = {
                    _id: id,
                    nama_tempat: document.getElementById('namaTempat').value,
                    lokasi: document.getElementById('lokasi').value,
                    fasilitas: document.getElementById('fasilitas').value,
                    lon: parseFloat(document.getElementById('lon').value),
                    lat: parseFloat(document.getElementById('lat').value),
                    gambar: document.getElementById('gambar').value
                };

                fetch('https://asia-southeast2-backend-438507.cloudfunctions.net/parkirgratisbackend/data/tempat', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                })
                .then(response => response.json().then(data => ({ status: response.status, body: data })))
                .then(({ status, body }) => {
                    if (status === 200) {
                        alert('Data updated successfully');
                        modal.style.display = 'none';
                        location.reload(); 
                    } else {
                        alert(`Error updating data: ${body.message}`);
                    }
                })
                .catch(error => {
                    console.error('Error updating data:', error);
                });
            });
        } else {
            alert('Unauthorized access\nMessage: ' + data.message);
            window.location.href = '../login.html'; 
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Unauthorized access\nError: ' + error.message);
        window.location.href = '../login.html'; 
    }
});

window.showUpdateForm = function(id, namaTempat, lokasi, fasilitas, lon, lat, gambar) {
    const modal = document.getElementById('updateModal');
    modal.style.display = 'block';

    document.getElementById('updateId').value = id;
    document.getElementById('namaTempat').value = namaTempat;
    document.getElementById('lokasi').value = lokasi;
    document.getElementById('fasilitas').value = fasilitas;
    document.getElementById('lon').value = lon;
    document.getElementById('lat').value = lat;
    document.getElementById('gambar').value = gambar;

    const gambarPreview = document.getElementById('gambarPreview');
    gambarPreview.src = gambar;
    gambarPreview.style.display = 'block';
}

window.deleteData = function(id, lon, lat, button) {
    const confirmation = confirm('Are you sure you want to delete this data?');
    if (!confirmation) {
        return;
    }

    console.log(`Deleting item with ID: ${id}`);

    const coordinates = [
        [lon, lat]
    ];

    fetch('https://asia-southeast2-backend-438507.cloudfunctions.net/parkirgratisbackend/data/tempat', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
        if (status === 200) {
            const coordData = {
                _id: id,
                markers: coordinates
            };

            fetch('https://asia-southeast2-backend-438507.cloudfunctions.net/parkirgratisbackend/data/koordinat', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(coordData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Coordinates deleted successfully:', data);
                alert('Coordinates deleted successfully!');
                location.reload(); 
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to delete coordinates!');
            });
        } else {
            console.error('Failed to delete the main data:', body);
            alert('Failed to delete the main data!');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while deleting the main data!');
    });
};
