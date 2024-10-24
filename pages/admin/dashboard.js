import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import {addCSS} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";

addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        Swal.fire({
            icon: "warning",
            title: "Can't Access Dashboard",
            text: "You need to login before accessing dashboard!",
            timer: 2000,
            customClass: {
                container: 'backdrop-blur-md',
            },
            showConfirmButton: false
          });
          setTimeout(() => {
            window.location.href = '../login/login.html';
          }, 2000);
        return;
    }

    try {
        const response = await fetch('https://asia-southeast2-backend-438507.cloudfunctions.net/parkirgratisbackend/admin/dashboard', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        const data = await response.json();

        if (response.status === 200) {
            if (!localStorage.getItem('alertShown')) {
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    backdrop: false,
                    customClass: {
                        container: 'no-blur-container',
                    },
                    didOpen: (toast) => {
                      toast.onmouseenter = Swal.stopTimer;
                      toast.onmouseleave = Swal.resumeTimer;
                    }
                });
                Toast.fire({
                    icon: "success",
                    title: "Anda telah masuk",
                    text: data.message + " dengan ID Admin: " + data.admin_id,
                });
                localStorage.setItem('alertShown', 'true');
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Access Restricted",
                text: data.message,
                timer: 2000,
                backdrop: true,
                customClass: {
                    container: 'backdrop-blur-md',
                },
                showConfirmButton: false
            });
            setTimeout(() => {
                window.location.href = '../login/login.html';
            }, 2000);
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Access Restricted",
            text: data.message,
            timer: 2000,
            backdrop: true,
            customClass: {
                container: 'backdrop-blur-md',
            },
            showConfirmButton: false
        });
        setTimeout(() => {
            window.location.href = '../login/login.html';
        }, 2000);
    }
});