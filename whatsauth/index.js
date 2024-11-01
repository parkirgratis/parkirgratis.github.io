import {getCookie} from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import {setInner} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import {getJSON} from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import {redirect} from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";

if (getCookie("login")===""){
    redirect("/");
}

getJSON("https://api.do.my.id/data/user","login",getCookie("login"),responseFunction)

function responseFunction(result){
    if (result.status === 404){
        setInner("content","Silahkan lakukan pendaftaran terlebih dahulu "+result.data.name);
        redirect("/parkirgratis.github.io/signup/pages/login/login.html");
    }else{
        setInner("content","Selamat datang "+result.data.name);
        redirect("/parkirgratis.github.io/pages/admin/addata.html");
    }
    console.log(result);
}