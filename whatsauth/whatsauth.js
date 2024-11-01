//import js whatsauth yang terbaru
import {qrController,deleteCookie} from "https://cdn.jsdelivr.net/gh/whatsauth/js@0.1.7/whatsauth.js";
import { wauthparam } from "https://cdn.jsdelivr.net/gh/whatsauth/js@0.1.7/config.js";

//definisikan url wss dan keyword menggunakan base64
wauthparam.auth_ws="d3NzOi8vYXBpLndhLm15LmlkL3dzL3doYXRzYXV0aC9wdWJsaWM=";
wauthparam.keyword="aHR0cHM6Ly93YS5tZS82MjgzMTMxODk1MDAwP3RleHQ9d2g0dDVhdXRoMA==";

//delete cookies session and call whatsauth qrController
deleteCookie(wauthparam.tokencookiename);
qrController(wauthparam);