import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import {addCSS} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";

addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

async function cancel() {
    Swal.fire({
        title: "Are you sure?",
        text: "The change won't be saved",
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `Nevermind`,
      }).then((result) => {
        if (result.isConfirmed) {
            localStorage.setItem('cancelToast', 'true');
            window.location.href = 'admin.html';
        } else if (result.isDenied) {
        //   Nothing happen
        }
      });
}

document.getElementById('cancelButton').addEventListener('click', () => {
    cancel();
});