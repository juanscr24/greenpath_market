import axios from "axios";
import { endpointUsers } from "./main.js"; // ajusta la ruta si es necesario

// Login Function 
async function loginUser(userName, password) {
    const { data } = await axios.get(
        `${endpointUsers}?userName=${userName}&password=${password}`
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
const inputUser = document.getElementById("userName");
const inputPass = document.getElementById("password");

// Login Event
btnSign.addEventListener("click", async () => {
    const username = inputUser.value.trim();
    const password = inputPass.value.trim();

    if (!username || !password) {
        alert("Por favor llena todos los campos");
        return;
    }

    try {
        const user = await loginUser(username, password);
        // Go to Dashboard
        window.location.href = "/src/views/dashboard.html";
    } catch (err) {
        alert("Credenciales incorrectas");
    }
});

