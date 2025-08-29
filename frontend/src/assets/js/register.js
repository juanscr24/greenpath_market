import { endpointRegister} from "./main";
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
        // Crear usuario
        const { data: createdUser } = await axios.post(endpointRegister, newUser);

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
