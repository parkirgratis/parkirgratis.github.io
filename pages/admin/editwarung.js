document.addEventListener('DOMContentLoaded', () => {
    window.showUpdateFormWarung = function (id, namaTempat, lokasi, jamBuka, metodePembayaran, lon, lat, fotoPratinjau) {
        console.log("Jam Buka:", jamBuka);
        console.log("fotoPratinjau:", fotoPratinjau);
        document.getElementById('updateIdWarung').value = id;
        document.getElementById('updateNamaTempatWarung').value = namaTempat || '';
        document.getElementById('updateLokasiWarung').value = lokasi || '';
        document.getElementById('updateJamBukaWarung').value = jamBuka || '';
        document.getElementById('updateMetodePembayaranWarung').value = metodePembayaran || '';
        document.getElementById('updateLonWarung').value = lon || '';
        document.getElementById('updateLatWarung').value = lat || '';
        document.getElementById('updateFotoPratinjauWarung').value = fotoPratinjau || '';

        document.getElementById('updateFormContainerWarung').classList.remove('hidden');
    };

    window.closeUpdateFormWarung = function () {
        document.getElementById('updateFormContainerWarung').classList.add('hidden');
    };

    const updateFormWarung = document.getElementById('updateFormWarung');
    if (updateFormWarung) {
        updateFormWarung.addEventListener('submit', async (e) => {
            e.preventDefault();

            const id = document.getElementById('updateIdWarung').value;
            const namaTempat = document.getElementById('updateNamaTempatWarung').value;
            const lokasi = document.getElementById('updateLokasiWarung').value;
            const jamBuka = document.getElementById('updateJamBukaWarung').value;
            const metodePembayaran = document.getElementById('updateMetodePembayaranWarung').value.split(',');
            const lon = parseFloat(document.getElementById('updateLonWarung').value);
            const lat = parseFloat(document.getElementById('updateLatWarung').value);
            const fotoPratinjau = document.getElementById('updateFotoPratinjauWarung').value;

            if (!id || !namaTempat || !lokasi || !jamBuka || isNaN(lon) || isNaN(lat)) {
                Swal.fire('Error', 'All fields must be filled correctly!', 'error');
                return;
            }

            const url = 'https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/data/warung';

            const data = {
                "_id": id,
                "nama_tempat": namaTempat,
                "lokasi": lokasi,
                "jam_buka": jamBuka,
                "metode_pembayaran": metodePembayaran,
                "lon": lon,
                "lat": lat,
                "foto_pratinjau": fotoPratinjau,
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
                console.log("Response data from server:", responseData);
                Swal.fire({
                    icon: "success",
                    title: "Successfully updated data",
                    text: "Data warung telah berhasil diperbarui.",
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