// Navbar role-based visibility
document.addEventListener('DOMContentLoaded', () => {
    const userData = localStorage.getItem("user");
    if (userData) {
        const user = JSON.parse(userData);
        if (user.role_id !== 2) {
            // Hide admin links for non-admin users
            const adminLinks = document.querySelectorAll('a[href="./admin.html"], a[href*="./admin.html"]');
            adminLinks.forEach(link => {
                link.style.display = 'none';
            });
        }
    }
});

export default {};
