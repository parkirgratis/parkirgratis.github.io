document.addEventListener('DOMContentLoaded', function () {
    const dataDisplayTable = document.getElementById('dataDisplayTable').getElementsByTagName('tbody')[0];

    fetch('https://asia-southeast2-fit-union-424704-a6.cloudfunctions.net/parkirgratisbackend/data/lokasi')
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const row = dataDisplayTable.insertRow();
                row.insertCell(0).textContent = item.nama_tempat;
                row.insertCell(1).textContent = item.lokasi;
                row.insertCell(2).textContent = item.fasilitas;
                row.insertCell(3).textContent = `${item.lon}, ${item.lat}`;
                
                const actionsCell = row.insertCell(4);
                actionsCell.innerHTML = `
                    <button type="button" style="background-color: #2ecc71;" onclick="showUpdateForm('${item._id}', '${item.nama_tempat}', '${item.lokasi}', '${item.fasilitas}', ${item.lon}, ${item.lat})">Update</button>
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
            lat: parseFloat(document.getElementById('lat').value)
        };

        fetch('https://asia-southeast2-fit-union-424704-a6.cloudfunctions.net/parkirgratisbackend/data/tempat', {
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
});

window.showUpdateForm = function(id, namaTempat, lokasi, fasilitas, lon, lat) {
    const modal = document.getElementById('updateModal');
    modal.style.display = 'block';

    document.getElementById('updateId').value = id;
    document.getElementById('namaTempat').value = namaTempat;
    document.getElementById('lokasi').value = lokasi;
    document.getElementById('fasilitas').value = fasilitas;
    document.getElementById('lon').value = lon;
    document.getElementById('lat').value = lat;
}


window.deleteData = function(id, lon, lat, button) {
    const confirmation = confirm('Are you sure you want to delete this data?');
    if (!confirmation) {
        return;
    }

    console.log(`Deleting item with ID: ${id}`);

    const coordinates = [
        [lon, lat]  // Use the actual coordinates passed as arguments
    ];

    // Delete the main data entry
    fetch('https://asia-southeast2-fit-union-424704-a6.cloudfunctions.net/parkirgratisbackend/data/tempat', {
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

            fetch('https://asia-southeast2-fit-union-424704-a6.cloudfunctions.net/parkirgratisbackend/data/koordinat', {
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
                location.reload(); // Refresh the page after successful deletion of coordinates
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

