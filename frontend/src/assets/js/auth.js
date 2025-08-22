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
            <input id="userName" type="text" placeholder="EMAIL">
            <input id="password" type="password" placeholder="PASSWORD">
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
            <input id="userName" type="text" placeholder="FULL NAME">
            <input id="email" type="email" placeholder="EMAIL">
            <input id="phone" type="text" placeholder="PHONE">
            <select name="documentType" id="documentType" required>
                <option value="" disabled selected>SELECT DOCUMENT TYPE...</option>
                <option value="1">NATIONAL ID</option>
                <option value="2">IDENTITY CARD</option>
                <option value="3">FOREIGN ID</option>
                <option value="4">PASSPORT</option>
            </select>
            <input id="documentNumber" type="text" placeholder="DOCUMENT NUMBER">
            <input id="password" type="password" placeholder="PASSWORD">
            <input id="passwordAgain" type="password" placeholder="PASSWORD AGAIN">
            <select name="role" id="role" required>
                <option value="" disabled selected>WHAT DO YOU WANT TO DO?</option>
                <option value="1">BE A CLIENT</option>
                <option value="2">BE A SELLER</option>
            </select>
            <input id="btnUp" type="submit" value="REGISTER">
        `;

        $containerToggle.innerHTML = `
            <button id="toggleLogin">Go to Login</button>
        `;
    }
}

$containerToggle.innerHTML = `<button id="toggleRegister">Go to Register</button>`;