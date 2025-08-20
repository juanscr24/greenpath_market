const btnLogout = document.getElementById("btnLogout");

if (btnLogout) {
    btnLogout.addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "./auth.html";
    });
}