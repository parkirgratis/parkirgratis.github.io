document.getElementById("formtempat").addEventListener("submit", async function (event) {
    event.preventDefault();

  
    document.getElementById("submitButton").disabled = true;
    const token = localStorage.getItem('token');

  
    if (!token) {
        alert("You need to log in before submitting this form.");
        window.location.href = '../login/login.html';
        return;
    }


    const formData = new FormData();
    formData.append("nama_tempat", document.getElementById("nama_tempat").value);
    formData.append("lokasi", document.getElementById("lokasi").value);
    formData.append("fasilitas", document.getElementById("fasilitas").value);

  
    const gambarInput = document.getElementById("gambar");
    if (gambarInput.files.length > 0) {
        formData.append("gambar", gambarInput.files[0]);
    }


    formData.append("lat", parseFloat(document.getElementById("lat").value));
    formData.append("lon", parseFloat(document.getElementById("lon").value));

    try {
     
        const response = await fetch("https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/tempat-parkir", {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formData
        });

        const result = await response.json(); 
        if (!response.ok) {
            console.error("Server Error:", result);
            alert("Failed to submit data: " + (result.Response || "Unknown error"));
        } else {
            alert("Parking location added successfully!");
        
            document.getElementById("formtempat").reset();
        }
    } catch (error) {
        console.error("Network Error:", error);
        alert("Failed to submit data due to a network error.");
    } finally {
        document.getElementById("submitButton").disabled = false;
    }
});
