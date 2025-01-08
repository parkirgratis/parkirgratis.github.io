import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { addCSS } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";
import {
    setInner,
    show,
    hide,
    getFileSize
  } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.0.6/croot.js";

// Add SweetAlert2 CSS
addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

async function cancel() {
    Swal.fire({
        title: "Are you sure?",
        text: "The change won't be saved",
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "Nevermind",
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.setItem("cancelToast", "true");
            window.location.href = "index.html";
        }
    });
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) {
            return value;
        }
    }
    return null;
}

async function handleSubmitPetapedia(event) {
    event.preventDefault();

    const token = getCookie("login");
    const longitude = parseFloat(document.getElementById("long").value);
    const latitude = parseFloat(document.getElementById("lat").value);

    if (isNaN(longitude) || isNaN(latitude) || longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
        Swal.fire("Error", "Please enter valid longitude and latitude values within valid ranges.", "error");
        return;
    }

    const requestData = { long: longitude, lat: latitude };

    try {
        const response = await fetch("https://asia-southeast2-awangga.cloudfunctions.net/petabackend/data/gis/lokasi", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "login": token,
            },
            body: JSON.stringify(requestData),
        });

        if (response.ok) {
            const result = await response.json();
            document.getElementById("province").value = result.province || "";
            document.getElementById("district").value = result.district || "";
            document.getElementById("sub_district").value = result.sub_district || "";
            document.getElementById("village").value = result.village || "";
            Swal.fire("Success", "Data successfully fetched from GIS.", "success");
        } else {
            const error = await response.json();
            Swal.fire("Error", `Failed to fetch data: ${JSON.stringify(error)}`, "error");
        }
    } catch (error) {
        Swal.fire("Error", "An unexpected error occurred. Please try again.", "error");
    }
}

async function insertRegionDataParking() {
    try {
        const province = document.getElementById("province").value;
        const district = document.getElementById("district").value;
        const sub_district = document.getElementById("sub_district").value;
        const village = document.getElementById("village").value;
        const lat = parseFloat(document.getElementById("lat").value);
        const lon = parseFloat(document.getElementById("long").value);
        const nama_tempat = document.getElementById("nama_tempat").value;
        const lokasi = document.getElementById("lokasi").value;
        const fasilitas = document.getElementById("fasilitas").value;
        const imageInput = document.getElementById("gambar");


        if (!province || !district || !sub_district || !village || isNaN(lon) || isNaN(lat) || !nama_tempat || !lokasi || !fasilitas) {
            Swal.fire("Error", "All fields are required.", "error");
            return;
        }

        const regionData = {
            province: province,
            district: district,
            sub_district: sub_district,
            village: village,
            lat: lat,
            lon: lon,
            nama_tempat: nama_tempat,
            lokasi: lokasi,
            fasilitas: fasilitas,
            imageInput: imageInput
        };

        const response = await fetch("https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/data/gis/lokasi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(regionData),
        });

        if (response.ok) {
            const result = await response.json();
            Swal.fire("Success", `Data successfully saved: ${JSON.stringify(result)}`, "success");
        } else {
            Swal.fire("Error", "Failed to save data.", "error");
        }
    } catch (error) {
        Swal.fire("Error", `An error occurred: ${error.message}`, "error");
    }
}

window.uploadImage = uploadImage;

const target_url = "https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/upload/img";

function uploadImage() {
    const gambar = document.getElementById('gambar');
    if (!igambar || gambar.files.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Silakan pilih file gambar terlebih dahulu"
        });
        return;
    }
    const gambarinput = document.getElementById('gambar');
    if (gambarinput) {
        hide("gambar");
    } else {
        console.error("Element with ID 'gambar' not found");
    }
    let besar = getFileSize("gambar");
    setInner("isi", besar);
    
    postFile(target_url, "gambar", "img", renderToHtml);
}

function renderToHtml(result) {
    console.log(result);
    setInner("isi", "https://parkirgratis.github.io/filegambar/" + result.response);
    show("gambar");
}


document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("locationForm");
    if (form) {
        form.addEventListener("submit", handleSubmitPetapedia);
    }

    const saveButton = document.getElementById("saveButton");
    if (saveButton) {
        saveButton.addEventListener("click", insertRegionDataParking);
    }
    
    const cancelButton = document.getElementById("cancelButton");
    if (cancelButton) {
        cancelButton.addEventListener("click", cancel);
    }
});
