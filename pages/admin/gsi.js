import {setCookieWithExpireHour} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/cookie.js";
import {postJSON} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/api.js";
import {redirect} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/url.js";
import {addCSSIn} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js';


await addCSSIn("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css","idhead");

const target_url="https://asia-southeast2-awangga.cloudfunctions.net/domyid/auth/users";

window.handleCredentialResponse = gSignIn;


async function gSignIn(response) {
    try {
        const gtoken = { token: response.credential };
        await postJSON(target_url, "login", "", gtoken, responsePostFunction);
    } catch (error) {
        console.error("Network or JSON parsing error:", error);
        Swal.fire({
            icon: "error",
            title: "Network Error",
            text: "An error occurred while trying to log in. Please try again.",
        });
    }
}



function responsePostFunction(response) {
    if (response.status === 200 && response.data) {
        // Menyimpan token dalam cookie
        setCookieWithExpireHour("login", response.data.token, 18);

        // Menampilkan greeting menggunakan SweetAlert
        Swal.fire({
            icon: "success",
            title: "Welcome!",
            text: `Hello, ${response.data.user?.name || "User"}!`,
            showConfirmButton: false,
            timer: 2000,
        }).then(() => {
            redirect("/parkirgratis.github.io/pages/admin/addata.html");
        });
    } else {
        console.error("Login failed:", response.data?.message || "Unknown error");
        Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: response.data?.message || "An unknown error occurred.",
        }).then(() => {
            redirect("/parkirgratis.github.io/signup/pages/login/login.html");
        });
    }
}