//logic logout
const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
  logoutButton.addEventListener("click", function (event) {
    event.preventDefault();
    Cookies.remove("login", {
      path: "/",
    });
    Swal.fire({
      icon: "success",
      title: "Logged Out",
      text: "You have been successfully logged out",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      window.location.href = "./pages/login";
    });
  });
}