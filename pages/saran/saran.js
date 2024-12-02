import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { addCSS } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";

addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

// Set default date to today
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('tanggal').value = today;
});

// Form submission handler
document.getElementById('saranForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const namaUser = document.getElementById('nama').value.trim();
    const gmailUser = document.getElementById('gmail').value.trim();
    const saranInput = document.getElementById('saran').value.trim();
    const tanggalInput = document.getElementById('tanggal').value;

    // Validate all fields
    if (!namaUser || !gmailUser || !saranInput || !tanggalInput) {
        Swal.fire({
            icon: "warning",
            title: "Form Tidak Lengkap",
            text: "Mohon isi semua field yang tersedia.",
            confirmButtonColor: '#3085d6'
        });
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(gmailUser)) {
        Swal.fire({
            icon: "warning",
            title: "Email Tidak Valid",
            text: "Mohon masukkan alamat email yang valid.",
            confirmButtonColor: '#3085d6'
        });
        return;
    }

    // Prepare data
    const data = {
        gmail: gmailUser,
        nama: namaUser,
        saran_user: saranInput,
        tanggal: new Date(tanggalInput).toISOString()
    };

    // Update button state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="animate-spin inline-block mr-2">↻</span> Mengirim...';

    try {
        const response = await fetch('https://asia-southeast2-awangga.cloudfunctions.net/parkirgratis/data/saran', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            await Swal.fire({
                icon: "success",
                title: "Terima Kasih",
                text: "Kritik dan saran Anda telah kami terima. Kami akan meninjau dan menindaklanjuti masukan Anda.",
                confirmButtonColor: '#3085d6',
                timer: 3000,
                timerProgressBar: true
            });
            document.getElementById('saranForm').reset();
            // Reset date to today after form reset
            document.getElementById('tanggal').value = new Date().toISOString().split('T')[0];
        } else {
            throw new Error('Server response was not OK');
        }
    } catch (error) {
        console.error("Error:", error);
        await Swal.fire({
            icon: "error",
            title: "Gagal Mengirim",
            text: "Terjadi kesalahan saat mengirim saran. Mohon coba lagi nanti.",
            confirmButtonColor: '#3085d6'
        });
    } finally {
        // Restore button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
});