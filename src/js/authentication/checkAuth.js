"use strict";
checkAuthAccess();
// Ser över om användaren har behörighet till admin-sidan
export function checkAuthAccess() {
    // Går inte att navigera till admin-sidan om användaren inte är inloggad
    if (window.location.pathname.endsWith("admin.html") && !localStorage.getItem("nyckel")) {
        window.location.href = "login.html"; // Redirect till login-sidan
    };

}