import '../sass/main.scss';

export const url = "http://localhost:3000/";

const responsePrint = document.querySelector(".response-text");

document.addEventListener("DOMContentLoaded", () => {

    getStartMsg();

    // Formuläret med inputs & knapp för att logga in en användare
    const loginForm = document.getElementById("login-user-form");
    const loginBtn = document.getElementById("login-user-btn");

    // Formuläret med inputs & knapp för att registrera en ny användare
    const registerForm = document.getElementById("add-user-form");
    const registerBtn = document.getElementById("add-user-btn");
    if (registerForm) {
        registerForm.addEventListener("submit", (event) => {
            event.preventDefault();
            let errors = [];

            // Hämtar värden inom registreringsformuläret
            const registerEmail = document.getElementById("register-email").value.trim();
            const registerPassword = document.getElementById("register-password").value.trim();
            const registerUsername = document.getElementById("register-username").value.trim();

            if (registerEmail === "") errors.push("Du måste fylla i email!");

            if (registerPassword === "") {
                errors.push("Du måste fylla i lösenord!")
            } else if (registerPassword.length < 6) {
                errors.push("Lösenordet måste vara minst 6 tecken!");
            }

            if (registerUsername === "") errors.push("Du måste fylla i användarnamn!");

            if (errors.length > 0) {
                displayErrorMsg(errors);
                return;
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            let errors = [];

            // Hämtar värden inom inloggningsformuläret
            const loginEmail = document.getElementById("login-email").value.trim();
            const loginPassword = document.getElementById("login-password").value.trim();
            const loginUsername = document.getElementById("login-username").value.trim();

            if (loginEmail === "") errors.push("Du måste fylla i email!");

            if (loginPassword === "") {
                errors.push("Du måste fylla i lösenord!")
            } else if (loginPassword.length < 6) {
                errors.push("Lösenordet måste vara minst 6 tecken!");
            }

            if (loginUsername === "") errors.push("Du måste fylla i användarnamn!");

            if (errors.length > 0) {
                displayErrorMsg(errors);
                return;
            }
        });
    }
});


function displayErrorMsg(errors) {
    const errorMsgList = document.querySelector(".error-message ul");
    errorMsgList.innerHTML = "";
    errors.forEach(error => {
        const liEl = document.createElement("li");
        liEl.textContent = error;
        errorMsgList.appendChild(liEl);
    });
}

async function getStartMsg() {
    try {
        const response = await fetch(`${url}`, {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error(`Kunde inte hämta webbtjänsten...`);
        }
        const data = await response.json();
        // Provar skriva ut välkomstmeddelandet på webbplatsen
        if (responsePrint) {
            responsePrint.innerHTML = JSON.stringify(data);
        }
        console.log("Respons från webbtjänst: ", data);
    } catch (error) {
        console.error("Gick inte att hämta data från webbtjänsten: ", error)
    }
}


async function createUser() {
    try {
        const response = await fetch(`${url}/api/register`, {
            method: "POST",

        });

        if (!response.ok) {
            throw new Error(`Kunde inte hämta webbtjänsten...`);
        }
        const data = await response.json();
        console.log("Respons från webbtjänst: ", data);
    } catch (error) {
        console.error("Gick inte att hämta data från webbtjänsten: ", error)
    }
}

async function loginUser() {
    try {

    } catch (error) {

    }
}