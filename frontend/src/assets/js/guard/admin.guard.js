// Admin Guard - Only allows access for users with role_id = 2 (admin)
const userData = localStorage.getItem("user");

if (!userData) {
    // No user data, redirect to login
    window.location.href = "/src/views/auth.html";
} else {
    const user = JSON.parse(userData);

    if (!user.role_id || user.role_id !== 2) {
        // Not an admin, redirect to dashboard
        alert("Acceso denegado. Solo administradores pueden acceder a esta página.");
        window.location.href = "/src/views/dashboard.html";
    }
}

export default {};
