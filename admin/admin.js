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
                    <button type="button" onclick="showUpdateForm('${item._id}', '${item.nama_tempat}', '${item.lokasi}', '${item.fasilitas}', ${item.lon}, ${item.lat})">Update</button>
                    <button type="button" onclick="deleteData('${item._id}', this)">Hapus</button>
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


window.deleteData = function(id, button) {
    const confirmation = confirm('Are you sure you want to delete this data?');
    if (!confirmation) {
        return;
    }

    console.log(`Deleting item with ID: ${id}`);  

    // Hapus dari database pertama
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
            // Hapus dari database kedua
            fetch('', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            })
            .then(response => response.json().then(data => ({ status: response.status, body: data })))
            .then(({ status, body }) => {
                if (status === 200) {
                    const row = button.parentNode.parentNode;
                    row.parentNode.removeChild(row);
                    alert('Data tempat dan koordinat Berhasil Dihapus');
                } else {
                    alert(`Error deleting data from second database: ${body.message}`);
                    console.error(`Error deleting data from second database: ${body.message}`);
                }
            })
            .catch(error => {
                console.error('Error deleting data from second database:', error);
            });
        } else {
            alert(`Error deleting data from first database: ${body.message}`);
            console.error(`Error deleting data from first database: ${body.message}`);
        }
    })
    .catch(error => {
        console.error('Error deleting data from first database:', error);
    });
}