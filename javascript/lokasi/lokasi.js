// lokasi.js

document.addEventListener("DOMContentLoaded", () => {
    const permissionPopup = document.getElementById("permission-popup");

    if (navigator.geolocation) {
        permissionPopup.style.display = "flex"; // tampilkan popup
    } else {
        alert("Geolocation tidak didukung oleh browser ini.");
    }
});

function requestLocation() {
    const permissionPopup = document.getElementById("permission-popup");
    permissionPopup.style.display = "none"; // sembunyikan popup

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            // Tambahkan kode untuk menampilkan lokasi atau memperbarui peta
        },
        (error) => {
            console.error("Gagal mendapatkan lokasi:", error.message);
            alert("Gagal mendapatkan lokasi. Silakan aktifkan GPS atau izinkan akses lokasi.");
        }
    );
}
