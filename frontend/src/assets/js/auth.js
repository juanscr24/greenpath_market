// It asks you before you exit or restart the page
window.onbeforeunload = () => "Estas seguro de Salir?"

// Get all elements by ID
const $container = document.getElementById("container");
const $form = document.getElementById("form");
const $formTitle = document.getElementById("formTitle");
const $img = document.getElementById("img");
const $containerToggle = document.getElementById("containerToggle");

// Validate Login
let isLogin = true;

$containerToggle.addEventListener("click", (e) => {
    if (e.target.id === "toggleRegister" || e.target.id === "toggleLogin") {
        toggleForm();
    }
});
// SPA for Register and Login
function toggleForm() {
    isLogin = !isLogin;
    // Login form
    if (isLogin) {
        $container.classList.add("login");
        $container.classList.remove("register");
        $formTitle.innerText = "Login";
        $img.src =
            "https://res.cloudinary.com/dd7vy0y6n/image/upload/f_auto,q_auto/v1755644602/back-login_vtle9y.jpg";

        $form.innerHTML = `
            <input id="userName" type="text" placeholder="Email">
            <input id="password" type="password" placeholder="Password">
            <input id="btnSign" type="button" value="SIGN IN">
        `;

        $containerToggle.innerHTML = `
            <button id="toggleRegister">Go to Register</button>
        `;
    // Register Form
    } else {
        $container.classList.add("register");
        $container.classList.remove("login");
        $formTitle.innerText = "Register";
        $img.src =
            "https://res.cloudinary.com/dd7vy0y6n/image/upload/f_auto,q_auto/v1755644601/back-register_uiimdr.jpg";

        $form.innerHTML = `
            <input id="userName" type="text" placeholder="Full Name">
            <input id="email" type="email" placeholder="Email">
            <input id="phone" type="text" placeholder="Phone">
            <select name="documentType" id="documentType" required>
                <option value="" disabled selected>Select Document Type...</option>
                <option value="1">National ID</option>
                <option value="2">Identity Card</option>
                <option value="3">Foreign ID</option>
                <option value="4">Passport</option>
            </select>
            <input id="documentNumber" type="text" placeholder="Document Number">
            <input type="date" name="birthdate" id="birthdate">
            <input id="password" type="password" placeholder="Password">
            <input id="passwordAgain" type="password" placeholder="Password Again">
            <select name="role" id="role" required>
                <option value="" disabled selected>What do you want to do?</option>
                <option value="1">Be a Client</option>
                <option value="2">Be a Seller</option>
            </select>
            <input id="btnUp" type="submit" value="REGISTER">
        `;

        $containerToggle.innerHTML = `
            <button id="toggleLogin">Go to Login</button>
        `;
    }
}

$containerToggle.innerHTML = `<button id="toggleRegister">Go to Register</button>`;