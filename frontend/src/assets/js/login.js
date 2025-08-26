import axios from "axios";
import { endpointLogin } from "./main.js"; 

async function loginUser(email, password) {
    const { data } = await axios.post(endpointLogin, {
        email: email,
        password: password
    });

    localStorage.setItem("user", JSON.stringify(data));
    return data;
}


// Get Elements DOM
const btnSign = document.getElementById("btnSign");
const inputUser = document.getElementById("email");
const inputPass = document.getElementById("password");

// Login Event
btnSign.addEventListener("click", async () => {
    const email = inputUser.value.trim();
    const password = inputPass.value.trim();

    if (!email || !password) {
        alert("Please fill out the login");
        return;
    }

    try {
        const user = await loginUser(email, password);
        // Go to Dashboard
        window.location.href = "/src/views/dashboard.html";
    } catch (err) {
        alert("Bad Credentials");
    }
});

