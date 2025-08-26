import { endpointUsers } from "./main";
import axios from "axios";

const $form = document.getElementById("form");

$form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Obtener valores
    const password = document.getElementById("password").value;
    const passwordAgain = document.getElementById("passwordAgain").value;

    // Validar password
    if (password !== passwordAgain) {
        alert("Passwords do not match!");
        return;
    }

    const newUser = {
        full_name: document.getElementById("userName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        id_document_type: parseInt(document.getElementById("documentType").value),
        document_number: document.getElementById("documentNumber").value.trim(),
        birthdate: document.getElementById('birthdate').value,
        user_password: password,
        user_address : document.getElementById('userAddress').value,
        id_rol: 1, // user
    };

    try {
        // traer usuarios existentes
        const { data: users } = await axios.get(endpointUsers);

        // Validaciones duplicados
        if (users.some(u => u.email === newUser.email)) {
            alert("Email already exists");
            return;
        }
        if (users.some(u => u.phone === newUser.phone)) {
            alert("Phone already exists");
            return;
        }
        if (users.some(u => u.document_number === newUser.document_number)) {
            alert("Document number already exists");
            return;
        }

        // Crear usuario
        const { data: createdUser } = await axios.post(endpointUsers, newUser);

        console.log("User registered:", createdUser);

        localStorage.setItem("user", JSON.stringify(createdUser));
        alert("User created and logged in!");
        $form.reset();

        // redirigir
        window.location.href = "/src/views/dashboard.html";

    } catch (error) {
        console.error("❌ Error creating user:", error);
        alert("Something went wrong!");
    }
});
