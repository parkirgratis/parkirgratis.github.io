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

    await uploadImage();
    const province = document.getElementById("province").value;
    const district = document.getElementById("district").value;
    const sub_district = document.getElementById("sub_district").value;
    const village = document.getElementById("village").value;
    const lat = parseFloat(document.getElementById("lat").value);
    const lon = parseFloat(document.getElementById("long").value);
    const nama_tempat = document.getElementById("nama_tempat").value;
    const lokasi = document.getElementById("lokasi").value;
    const fasilitas = document.getElementById("fasilitas").value;
    const imageInput = document.getElementById("gambar").value;
    const fileName = imageInput.files[0] ? imageInput.files[0].name : '';

    if (!province || !district || !sub_district || !village || isNaN(lon) || isNaN(lat) || !nama_tempat || !lokasi || !fasilitas) {
        Swal.fire({
            icon: "warning",
            title: "Gagal",
            text: "Harap isi semua field"
        });
        return;
    }

    const url = "https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/data/gis/lokasi";
    const data = {
        province: province,
        district: district,
        sub_district: sub_district,
        village: village,
        lon: lon,
        lat: lat,
        nama_tempat: nama_tempat,
        lokasi: lokasi,
        fasilitas: fasilitas,
        gambar: fileName || "",
    };

    console.log("Data yang akan dikirim:", data);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }

        let besar = getFileSize("gambar");
        setInner("isi", besar);

        const responseData = await response.json();
        console.log("Response data dari server:", responseData);

        Swal.fire({
            icon: "success",
            title: "Berhasil menambah data",
            text: "Data parkir ini telah berhasil disimpan.",
        });

        setTimeout(() => {
            closeUpdateForm();
            location.reload();
        }, 2000);

    } catch (error) {
        console.error("Error updating data:", error);
        Swal.fire({
            icon: "error",
            title: "Gagal Menyimpan Data",
            text: "Data gagal disimpan.",
            timer: 2000,
        });
    }
}

window.uploadImage = uploadImage;

const target_url =
  "https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/upload/img";

async function uploadImage() {
  const imageInput = document.getElementById("gambar");
  if (!imageInput || imageInput.files.length === 0) {
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: "Silakan pilih file gambar terlebih dahulu",
    });
    return;
  }

  try {
    const inputFileElement = document.getElementById("gambar");
    if (inputFileElement) {
      hide("gambar");
    }

    const fileSize = getFileSize("gambar");
    setInner("isi", fileSize);

    // Upload file
    await postFile(target_url, "gambar", "img", renderToHtml);
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

function renderToHtml(result) {
  try {
    console.log(result);
    if (result.error) {
      throw new Error(result.error.message || "Unknown error in response");
    }

    const isiElement = document.getElementById("isi");
    if (!isiElement) {
      throw new Error("Element with ID 'isi' not found");
    }

    const imageUrl =
      "https://parkirgratis.if.co.id/filegambar/" + result.response;

    const existingImage = isiElement.querySelector("img");
    if (existingImage) {
      existingImage.src = imageUrl;
    } else {
      const newImage = document.createElement("img");
      newImage.src = imageUrl;
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
