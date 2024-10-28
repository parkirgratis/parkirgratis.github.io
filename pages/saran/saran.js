import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import {addCSS} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";

addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

document.getElementById('saranForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const saranInput = document.getElementById('saran').value;

    if (!saranInput) {
        Swal.fire({
            icon: "warning",
            title: "Tidak dapat mengirim saran!",
            text: "Textbox saran tidak boleh kosong.."
        });
        return;
    }

    const data = {
        saran_user: saranInput
    };

    try {
        const response = await fetch('https://asia-southeast2-backend-438507.cloudfunctions.net/parkirgratisbackend/data/saran', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "Terima Kasih",
                text: "Kritik dan saran anda telah kami simpan, semoga harimu selalu senin"
            });
            document.getElementById('saranForm').reset();
        } else {
            Swal.fire({
                icon: "warning",
                title: "Gagal mengirim feedback",
                text: "Kritik dan saran anda telah kami simpan, semoga harimu selalu senin"
            });
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Gagal mengirim feedback",
            text: error
        });
    }
});
