//import js whatsauth yang terbaru
import {qrController,deleteCookie} from "https://cdn.jsdelivr.net/gh/whatsauth/js@0.3.3/whatsauth.js";
import { wauthparam } from "https://cdn.jsdelivr.net/gh/whatsauth/js@0.3.3/config.js";

// Fungsi sweet Alert WhatsAuth login
function openSweetAlertLogin(){
    Swal.fire({
        icon: "info",
        title: "<strong>Login <u>Dulu</u> Coy</strong>",
        html: `
        <div class="flex justify-center mt-2 mb-4" id="whatsauthqr">
        <svg class="lds-microsoft" width="80px"  height="80px"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><g transform="rotate(0)"><circle cx="81.73413361164941" cy="74.35045716034882" fill="#e15b64" r="5" transform="rotate(340.001 49.9999 50)">
                        <animateTransform attributeName="transform" type="rotate" calcMode="spline" values="0 50 50;360 50 50" times="0;1" keySplines="0.5 0 0.5 1" repeatCount="indefinite" dur="1.5s" begin="0s"></animateTransform>
                      </circle><circle cx="74.35045716034882" cy="81.73413361164941" fill="#f47e60" r="5" transform="rotate(348.352 50.0001 50.0001)">
                        <animateTransform attributeName="transform" type="rotate" calcMode="spline" values="0 50 50;360 50 50" times="0;1" keySplines="0.5 0 0.5 1" repeatCount="indefinite" dur="1.5s" begin="-0.0625s"></animateTransform>
                      </circle><circle cx="65.3073372946036" cy="86.95518130045147" fill="#f8b26a" r="5" transform="rotate(354.236 50 50)">
                        <animateTransform attributeName="transform" type="rotate" calcMode="spline" values="0 50 50;360 50 50" times="0;1" keySplines="0.5 0 0.5 1" repeatCount="indefinite" dur="1.5s" begin="-0.125s"></animateTransform>
                      </circle><circle cx="55.22104768880207" cy="89.65779445495241" fill="#abbd81" r="5" transform="rotate(357.958 50.0002 50.0002)">
                        <animateTransform attributeName="transform" type="rotate" calcMode="spline" values="0 50 50;360 50 50" times="0;1" keySplines="0.5 0 0.5 1" repeatCount="indefinite" dur="1.5s" begin="-0.1875s"></animateTransform>
                      </circle><circle cx="44.77895231119793" cy="89.65779445495241" fill="#849b87" r="5" transform="rotate(359.76 50.0064 50.0064)">
                        <animateTransform attributeName="transform" type="rotate" calcMode="spline" values="0 50 50;360 50 50" times="0;1" keySplines="0.5 0 0.5 1" repeatCount="indefinite" dur="1.5s" begin="-0.25s"></animateTransform>
                      </circle><circle cx="34.692662705396415" cy="86.95518130045147" fill="#e15b64" r="5" transform="rotate(0.183552 50 50)">
                        <animateTransform attributeName="transform" type="rotate" calcMode="spline" values="0 50 50;360 50 50" times="0;1" keySplines="0.5 0 0.5 1" repeatCount="indefinite" dur="1.5s" begin="-0.3125s"></animateTransform>
                      </circle><circle cx="25.649542839651176" cy="81.73413361164941" fill="#f47e60" r="5" transform="rotate(1.86457 50 50)">
                        <animateTransform attributeName="transform" type="rotate" calcMode="spline" values="0 50 50;360 50 50" times="0;1" keySplines="0.5 0 0.5 1" repeatCount="indefinite" dur="1.5s" begin="-0.375s"></animateTransform>
                      </circle><circle cx="18.2658663883506" cy="74.35045716034884" fill="#f8b26a" r="5" transform="rotate(5.45126 50 50)">
                        <animateTransform attributeName="transform" type="rotate" calcMode="spline" values="0 50 50;360 50 50" times="0;1" keySplines="0.5 0 0.5 1" repeatCount="indefinite" dur="1.5s" begin="-0.4375s"></animateTransform>
                      </circle><animateTransform attributeName="transform" type="rotate" calcMode="spline" values="0 50 50;0 50 50" times="0;1" keySplines="0.5 0 0.5 1" repeatCount="indefinite" dur="1.5s"></animateTransform></g>
        </svg>
        </div>
        <p class="font-bold text-center mb-4" id="whatsauthcounter">counter</p>
        `,
        didRender: function () {
          // Tutup sweet alert setelah berhasil scan
          window.addEventListener('hashchange', closeSweetAlert);
          //definisikan url wss dan keyword menggunakan base64
          wauthparam.auth_ws="d3NzOi8vYXBpLndhLm15LmlkL3dzL3doYXRzYXV0aC9wdWJsaWM=";
          wauthparam.keyword="aHR0cHM6Ly93YS5tZS82MjgzMTMxODk1MDAwP3RleHQ9d2g0dDVhdXRoMA==";
          wauthparam.redirect="#"+crypto.randomUUID();

          qrController(wauthparam);
        }
      });
}