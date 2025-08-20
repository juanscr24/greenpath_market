import { endpointUsers } from "./main";
import axios from "axios";

const $form = document.getElementById("form");

$form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = {
        fullName: document.getElementById("fullName").value.trim(),
        userName: document.getElementById("userName").value.trim(),
        email: document.getElementById("email").value.trim(),
        address: document.getElementById("address").value.trim(),
        documentType: document.getElementById("documentType").value,
        documentNumber: document.getElementById("documentNumber").value.trim(),
        password: document.getElementById("password").value,
        passwordAgain: document.getElementById("passwordAgain").value,
        role: document.getElementById("role").value,
    };

    // Validación contraseñas
    if (user.password !== user.passwordAgain) {
        alert("Passwords do not match!");
        return;
    }

    try {
        // Obtener usuarios existentes
        const { data: users } = await axios.get(endpointUsers);

        // Validaciones de duplicados
        if (users.some(u => u.userName === user.userName)) {
            alert("Username already exists");
            return;
        }

        if (users.some(u => u.email === user.email)) {
            alert("Email already exists");
            return;
        }

        if (users.some(u => u.documentNumber === user.documentNumber)) {
            alert("Document number already exists");
            return;
        }

        // Crear usuario
        const { data: newUser } = await axios.post(endpointUsers, user);

        console.log("User registered:", newUser);

        // Guardar en localStorage para dejarlo logeado
        localStorage.setItem("user", JSON.stringify(newUser));

        alert("User created and logged in!");
        $form.reset();

        // Redirigir al dashboard
        window.location.href = "/src/views/dashboard.html";

    } catch (error) {
        console.error("❌ Error creating user:", error);
        alert("Something went wrong!");
    }
});
