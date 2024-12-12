document.addEventListener('DOMContentLoaded', () => {
    window.showUpdateFormWarung = function (id, Nama_Tempat, Lokasi, Jam_Buka, Metode_Pembayaran, Lon, Lat, Gambar) {
        console.log("Jam Buka:", Jam_Buka);
        console.log("fotoPratinjau:", Gambar);
        document.getElementById('updateIdWarung').value = id;
        document.getElementById('updateNamaTempatWarung').value = Nama_Tempat || '';
        document.getElementById('updateLokasiWarung').value = Lokasi || '';
        document.getElementById('updateJamBukaWarung').value = Jam_Buka || '';
        document.getElementById('updateMetodePembayaranWarung').value = Metode_Pembayaran || '';
        document.getElementById('updateLonWarung').value = Lon || '';
        document.getElementById('updateLatWarung').value = Lat || '';
        document.getElementById('updateFotoPratinjauWarung').value = Gambar || '';

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
            const Nama_Tempat = document.getElementById('updateNamaTempatWarung').value;
            const Lokasi = document.getElementById('updateLokasiWarung').value;
            const Jam_Buka = document.getElementById('updateJamBukaWarung').value;
            const Metode_Pembayaran = document.getElementById('updateMetodePembayaranWarung').value.split(',');
            const Lon = parseFloat(document.getElementById('updateLonWarung').value);
            const Lat = parseFloat(document.getElementById('updateLatWarung').value);
            const Gambar = document.getElementById('updateFotoPratinjauWarung').value;

            if (!id || !Nama_Tempat || !Lokasi || !Jam_Buka || isNaN(Lon) || isNaN(Lat)) {
                Swal.fire('Error', 'All fields must be filled correctly!', 'error');
                return;
            }

            const url = 'https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/data/warung';

            const data = {
                "_id": id,
                "nama_tempat": Nama_Tempat,
                "lokasi": Lokasi,
                "jam_buka": Jam_Buka || '',
                "metode_pembayaran": Metode_Pembayaran,
                "lon": Lon,
                "lat": Lat,
                "foto_pratinjau": Gambar || ''
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