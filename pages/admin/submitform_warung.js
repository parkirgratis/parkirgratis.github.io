import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { addCSS } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";
import {
    setInner,
    show,
    hide,
    getFileSize
  } from "https://cdn.jsdelivr.net/gh/jscroot/element@0.0.6/croot.js";
  import { postFile } from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.2/croot.js";

// Add SweetAlert2 CSS
addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

document.addEventListener("DOMContentLoaded", () => {
    const cancelButton = document.getElementById("cancelButton");
    if (cancelButton) {
        cancelButton.addEventListener("click", cancel);
    }
});

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

document.getElementById("locationForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const token = getCookie("login");
    const longitude = parseFloat(document.getElementById("long").value);
    const latitude = parseFloat(document.getElementById("lat").value);


    if (isNaN(longitude) || isNaN(latitude) || longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
        Swal.fire("Error", "Please enter valid longitude and latitude values within valid ranges.", "error");
        return;
    }

    const requestData = { long: longitude, lat: latitude };

    fetch("https://asia-southeast2-awangga.cloudfunctions.net/petabackend/data/gis/lokasi", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "login": token,
        },
        body: JSON.stringify(requestData),
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((error) => {
                    throw new Error(error.message || "Failed to fetch data.");
                });
            }
            return response.json();
        })
        .then((result) => {
           
            document.getElementById("province").value = result.province || "";
            document.getElementById("district").value = result.district || "";
            document.getElementById("sub_district").value = result.sub_district || "";
            document.getElementById("village").value = result.village || "";

            Swal.fire("Success", "Data successfully fetched from GIS.", "success");
        })
        .catch((error) => {
            Swal.fire("Error", `An unexpected error occurred: ${error.message}`, "error");
        });
});

document.getElementById("saveButton").addEventListener("click", async (e) => {
    e.preventDefault();
    await uploadImageWarung();

    const province = document.getElementById("province").value;
    const district = document.getElementById("district").value;
    const subDistrict = document.getElementById("sub_district").value;
    const village = document.getElementById("village").value;
    const lat = parseFloat(document.getElementById("lat").value);
    const lon = parseFloat(document.getElementById("long").value);
    const namaTempat = document.getElementById("nama_tempat").value;
    const lokasi = document.getElementById("lokasi").value;
    const metodePembayaran = document.getElementById("metode_pembayaran").value.split(",");
    const gambar = document.getElementById("gambar");
    const fileName = gambar.files[0] ? gambar.files[0].name : '';

    if (
        !province ||
        !district ||
        !subDistrict ||
        !village ||
        isNaN(lat) ||
        isNaN(lon) ||
        !namaTempat ||
        !lokasi ||
        metodePembayaran.length === 0 || 
        metodePembayaran.some((metode) => !metode.trim()) ||
        !fileName
    ) {
        Swal.fire(
            "Error", 
            "All fields are required.", 
            "error"
        );
        return;
    }
    

        const url = "https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/data/gis/warung";
        const regionData = {
        province: province,
        district: district,
        sub_district: sub_district,
        village: village,
        lat: lat,
        lon: lon,
        nama_tempat: nama_tempat,
        lokasi: lokasi,
        metode_pembayaran: metodePembayaran,
        gambar: fileName || "",
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(regionData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }

        let besar = getFileSize("gambar");
        setInner("isi", besar);

        const responseData = await response.json();
        console.log("Response data from server:", responseData);
        Swal.fire({
            icon: "success",
            title: "Berhasil menambah data",
            text: "Data warung telah berhasil disimpan",
            timer: 2000,
        });
    } catch (error) {
        console.error("Error save warung data:", error);
        Swal.fire({
            icon: "error",
            title: "Failed to save Data",
            text: "Failed to save data, please try again.",
        });
    }
});

window.uploadImageWarung = uploadImageWarung;

const target_url_warung = "https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/upload/img";

async function uploadImageWarung() {
    const gambar = document.getElementById('gambar');
    if (!gambar || gambar.files.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Silakan pilih file gambar terlebih dahulu"
        });
        return;
    }
    try {
        const inputFileElement = document.getElementById("gambar");
        if (inputFileElement) {
            hide("gambar");
        }

        const fileSizeWarung = getFileSize("gambar");
        setInner("isi", fileSizeWarung);

        await postFile(target_url_warung, "gambar", "img", renderToHtmlWarung);
    } catch (error) {
        console.error("Error uploading image:", error);
        Swal.fire({
            icon: "error",
            title: "Error Uploading Image",
            text: error.message,
        });

        const inputFileElement = document.getElementById("gambar");
        if (inputFileElement) {
            show("gambar");
        }
    }
}

function renderToHtmlWarung(result) {
    try {
        console.log(result);
        if (result.error) {
            throw new Error(result.error.message || "Unknown error in response");
        }

        const isiElement = document.getElementById("isi");
        if (!isiElement) {
            throw new Error("Element with ID 'isiWarung' not found");
        }

        const imageUrlWarung = "https://parkirgratis.if.co.id/filegambar/" + result.response;

        const existingImage = isiElement.querySelector("img");
        if (existingImage) {
            existingImage.src = imageUrlWarung;
        } else {
            const newImage = document.createElement("img");
            newImage.src = imageUrlWarung;
            newImage.alt = "Uploaded Image";
            isiElement.appendChild(newImage);
        }
        show("gambar");
    } catch (error) {
        console.error("Error rendering HTML:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to process uploaded image.",
        });
    }
}
    