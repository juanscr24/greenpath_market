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
            <input id="userName" type="text" placeholder="U S E R N A M E">
            <input id="password" type="password" placeholder="P A S S W O R D">
            <input id="btnSign" type="button" value="S I G N   I N">
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
            <input id="fullName" type="text" placeholder="F U L L   N A M E">
            <input id="documentType" type="text" placeholder="D O C U M E N T   T Y P E">
            <input id="email" type="email" placeholder="E M A I L">
            <input id="userName" type="text" placeholder="U S E R N A M E">
            <input id="password" type="password" placeholder="P A S S W O R D">
            <input id="passwordAgain" type="password" placeholder="P A S S W O R D   A G A I N">
            <input id="address" type="text" placeholder="A D D R E S S">
            <input id="btnUp" type="button" value="R E G I S T E R">
        `;

        $containerToggle.innerHTML = `
            <button id="toggleLogin">Go to Login</button>
        `;
    }
}

$containerToggle.innerHTML = `<button id="toggleRegister">Go to Register</button>`;