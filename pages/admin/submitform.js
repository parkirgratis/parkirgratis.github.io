document.getElementById("FormTempat").addEventListener("submit", async function (event) {
    event.preventDefault();

    const submitButton = document.getElementById("submitButton");
    submitButton.disabled = true;
    const token = localStorage.getItem('token');

    if (!token) {
        alert("You need to log in before submitting this form.");
        window.location.href = '../login/login.html';
        return;
    }

    // Gather form data
    const placeName = document.getElementById('nama_tempat').value.trim();
    const location = document.getElementById('lokasi').value.trim();
    const facilities = document.getElementById('fasilitas').value.trim();
    const latitude = parseFloat(document.getElementById('lat').value.trim());
    const longitude = parseFloat(document.getElementById('long').value.trim());
    const imageFile = document.getElementById('gambar').files[0];

    // Log values for debugging
    console.log("Place Name:", placeName);
    console.log("Location:", location);
    console.log("Facilities:", facilities);
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);
    console.log("Image File:", imageFile);
    console.log("Type of Latitude:", typeof latitude);
    console.log("Type of Longitude:", typeof longitude);

    // Validate each field to match the database structure requirements
    if (!placeName || !location || !facilities || isNaN(latitude) || isNaN(longitude) || !imageFile) {
        alert("All fields are required. Please ensure that each field is filled correctly.");
        submitButton.disabled = false;
        return;
    }

    const formData = new FormData();
    formData.append("nama_tempat", placeName);
    formData.append("lokasi", location);
    formData.append("fasilitas", facilities);
    formData.append("lat", latitude.toString());  // Ensure it's sent as string
    formData.append("lon", longitude.toString()); // Ensure it's sent as string
    formData.append("gambar", imageFile);

    try {
        const response = await fetch("https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/tempat-parkir", {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formData
        });

        const resultText = await response.text();
        console.log("Response Status:", response.status);
        console.log("Response Text:", resultText);

        if (!response.ok) {
            console.error("Server Error:", resultText);
            alert("Failed to submit data: " + (resultText || "Unknown error"));
        } else {
            alert("Parking location added successfully!");
            document.getElementById("FormTempat").reset();
        }
    } catch (error) {
        console.error("Network Error:", error);
        alert("Failed to submit data due to a network error.");
    } finally {
        submitButton.disabled = false;
    }
});
