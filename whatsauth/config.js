import { IsMobile,getParamsfromURL } from "./whatsauth.js"

export let wauthparam={
    redirect : "./auth",
    auth_ws : "d3NzOi8vYXV0aC51bGJpLmFjLmlkL3dzL3doYXRzYXV0aC9xcg==",
    keyword : "aHR0cHM6Ly93YS5tZS82MjgxMTIwMDAyNzk/dGV4dD13aDR0NWF1dGgw",
    domaincookie : window.location.host,
    interval : 30,
    maxqrwait : 90,
    tokencookiehourslifetime : 2,
    id_qr : "whatsauthqr",
    id_counter : "whatsauthcounter",
    tokencookiename : "login",
    apphost : btoa(document.location.href),
    rto :0,
    countdown:0,
    wsocket:0,
    mobile:IsMobile(),
    urlgetparams:getParamsfromURL(),
    jsonres:null,
    uuid:null,
    waurl:null
}