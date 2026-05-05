"use strict";
checkAuthAccess();
// Ser över om användaren har behörighet till admin-sidan
export function checkAuthAccess() {
    const adminUser = document.getElementById("admin-user");
    const newsForm = document.getElementById("add-news-form");
    // Går inte att navigera till admin-sidan om användaren inte är inloggad
    if (window.location.pathname.endsWith("admin.html") && !localStorage.getItem("nyckel")) {
        adminUser.innerHTML = "";
        newsForm.innerHTML = "";
        window.location.href = "login.html"; // Redirect till login-sidan
    };

}