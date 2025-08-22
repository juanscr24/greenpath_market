import axios from "axios";
import { endpointUsers } from "./main.js"; 

// Login Function 
async function loginUser(email, password) {
    const { data } = await axios.get(
        `${endpointUsers}?email=${email}&user_password=${password}`
    );

    if (data.length > 0) {
        localStorage.setItem("user", JSON.stringify(data[0]));
        return data[0];
    } else {
        throw new Error("Credenciales inválidas");
    }
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

