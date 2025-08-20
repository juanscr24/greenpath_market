const $container = document.getElementById("container");
const $form = document.getElementById("form");
const $formTitle = document.getElementById("formTitle");
const $img = document.getElementById("img");
const $containerToggle = document.getElementById("containerToggle");

let isLogin = true;

$containerToggle.addEventListener("click", (e) => {
    if (e.target.id === "toggleRegister" || e.target.id === "toggleLogin") {
        toggleForm();
    }
});

function toggleForm() {
    isLogin = !isLogin;

    if (isLogin) {
        $container.classList.add("login");
        $container.classList.remove("register");
        $formTitle.innerText = "Login";
        $img.src =
            "https://res.cloudinary.com/dd7vy0y6n/image/upload/f_auto,q_auto/v1755644602/back-login_vtle9y.jpg";

        $form.innerHTML = `
            <input id="userName" type="text" placeholder="EMAIL OR USERNAME">
            <input id="password" type="password" placeholder="PASSWORD">
            <input id="btnSign" type="button" value="SIGN IN">
        `;

        $containerToggle.innerHTML = `
            <button id="toggleRegister">Go to Register</button>
        `;
    } else {
        $container.classList.add("register");
        $container.classList.remove("login");
        $formTitle.innerText = "Register";
        $img.src =
            "https://res.cloudinary.com/dd7vy0y6n/image/upload/f_auto,q_auto/v1755644601/back-register_uiimdr.jpg";

        $form.innerHTML = `
            <input id="fullName" type="text" placeholder="FULL NAME">
            <input id="userName" type="text" placeholder="USERNAME">
            <input id="email" type="email" placeholder="EMAIL">
            <input id="address" type="text" placeholder="ADDRESS">
            <select name="documentType" id="documentType" required>
                <option value="" disabled selected>SELECT DOCUMENT TYPE...</option>
                <option value="id">NATIONAL ID</option>
                <option value="identityCard">IDENTITY CARD</option>
                <option value="foreignId">FOREIGN ID</option>
                <option value="passport">PASSPORT</option>
            </select>
            <input id="documentNumber" type="text" placeholder="DOCUMENT NUMBER">
            <input id="password" type="password" placeholder="PASSWORD">
            <input id="passwordAgain" type="password" placeholder="PASSWORD AGAIN">
            <select name="role" id="role" required>
                <option value="" disabled selected>WHAT DO YOU WANT TO DO?</option>
                <option value="seller">BE A SELLER</option>
                <option value="client">BE A CLIENT</option>
            </select>
            <input id="btnUp" type="submit" value="REGISTER">
        `;

        $containerToggle.innerHTML = `
            <button id="toggleLogin">Go to Login</button>
        `;
    }
}

$containerToggle.innerHTML = `<button id="toggleRegister">Go to Register</button>`;