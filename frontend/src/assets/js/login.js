import axios from "axios";
import { endpointUsers } from "./main.js"; // ajusta la ruta si es necesario

// Función para login
async function loginUser(username, password) {
    const { data } = await axios.get(
        `${endpointUsers}?email=${username}&password=${password}`
    );

    if (data.length > 0) {
        localStorage.setItem("user", JSON.stringify(data[0]));
        return data[0];
    } else {
        throw new Error("Credenciales inválidas");
    }
}

// Capturar elementos del DOM
const btnSign = document.getElementById("btnSign");
const inputUser = document.getElementById("userName");
const inputPass = document.getElementById("password");

// Evento de login
btnSign.addEventListener("click", async () => {
    const username = inputUser.value.trim();
    const password = inputPass.value.trim();

    if (!username || !password) {
        alert("Por favor llena todos los campos");
        return;
    }

    try {
        const user = await loginUser(username, password);
        // ✅ Redirigir al dashboard.html en tu MPA
        window.location.href = "/src/views/dashboard.html";
    } catch (err) {
        alert("Credenciales incorrectas");
    }
});

