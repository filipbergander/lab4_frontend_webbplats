"use strict";

import '../sass/main.scss';

// Global URL till webbtjänsten i backend
export const url = "http://localhost:3000/";

const responsePrint = document.querySelector(".response-text");

document.addEventListener("DOMContentLoaded", () => {

    getStartMsg();
    changeLoginMenu();
    // Formuläret med knapp & laddningsikon för att logga in en användare
    const loginForm = document.getElementById("login-user-form");
    const loginBtn = document.getElementById("login-user-btn");

    // Formuläret med knapp för att registrera en ny användare
    const registerForm = document.getElementById("add-user-form");
    const registerBtn = document.getElementById("add-user-btn");

    // Eventlyssnare för registreringsformuläret
    if (registerForm) {
        registerForm.addEventListener("submit", (event) => {
            event.preventDefault();
            let errors = [];

            // Hämtar värden inom registreringsformuläret
            const registerEmail = document.getElementById("register-email").value.trim();
            const registerPassword = document.getElementById("register-password").value.trim();
            const registerUsername = document.getElementById("register-username").value.trim();

            // Specifika felmeddelande för inputs
            if (registerEmail === "") errors.push("Du måste fylla i email!");
            if (registerPassword === "") {
                errors.push("Du måste fylla i lösenord!")
            } else if (registerPassword.length < 6) {
                errors.push("Lösenordet måste vara minst 6 tecken!");
            }
            if (registerUsername === "") errors.push("Du måste fylla i användarnamn!");

            // Om felmeddelanden finns visas dem genom funktionen displayErrorMsg
            if (errors.length > 0) {
                displayErrorMsg(errors);
                return; // Stoppar formuläret från att bli submittat
            } else { // Annars om inga felmeddelanden finns, anropas createUser
                createUser();
            }
        });
    }
    // Eventlyssnare för inloggningsformuläret
    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            let errors = [];

            // Hämtar värden inom inloggningsformuläret
            const loginEmail = document.getElementById("login-email").value.trim();
            const loginPassword = document.getElementById("login-password").value.trim();
            const loginUsername = document.getElementById("login-username").value.trim();

            // Specifika felmeddelande för inputs
            if (loginEmail === "") errors.push("Du måste fylla i email!");
            if (loginPassword === "") {
                errors.push("Du måste fylla i lösenord!")
            } else if (loginPassword.length < 6) {
                errors.push("Lösenordet måste vara minst 6 tecken!");
            }
            if (loginUsername === "") errors.push("Du måste fylla i användarnamn!");
            // Om felmeddelanden finns visas dem genom funktionen displayErrorMsg
            if (errors.length > 0) {
                displayErrorMsg(errors);
                return; // Stoppar formuläret från att bli submittat
            } else {
                loginUser(); // Loggar in användaren genom funktionen
            }
        });
    }
});
// Funktion som skriver ut felmeddelanden i DOM
function displayErrorMsg(errors) {
    const errorMsgList = document.querySelector(".error-message ul");
    errorMsgList.innerHTML = "";
    errors.forEach(error => {
        const liEl = document.createElement("li"); // Skapar ett li för varje specifikt felmeddelande
        liEl.textContent = error; // Tillger li-elementet texten som genererats inom arrayen av errors
        errorMsgList.appendChild(liEl); // Lägger till li-elementet inom felmeddelande-listan
    });
}

function showError(err) {
    const errorMsgList = document.querySelector(".error-message ul");
    errorMsgList.innerHTML = "";
    const li = document.createElement("li");
    li.textContent = err;
    errorMsgList.appendChild(li);
}

// Funktion för att visa inloggning fungerade i DOM
function displaySuccessMsg(successMsg) {

    //Lyckas success med meddelande inom DOM
    const successMsgList = document.querySelector(".success-message ul");
    successMsgList.innerHTML = "";
    const liEl = document.createElement("li");
    liEl.textContent = successMsg;
    successMsgList.appendChild(liEl);
}

async function getStartMsg() {
    try {
        const response = await fetch(`${url}`, {
            method: "GET"
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Kunde inte hämta webbtjänsten...`);
        }
        console.log("Respons från webbtjänst: ", data);
    } catch (error) {
        console.error("Gick inte att hämta data från webbtjänsten: ", error)
    }
}
// För att skapa en ny användare
async function createUser() {
    // Inputs inom formuläret 
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();
    const username = document.getElementById("register-username").value.trim();

    const errorMsgList = document.querySelector(".error-message ul"); // Felmeddelanden
    const successMsgList = document.querySelector(".success-message ul"); // Meddelanden vid lyckat resultat
    successMsgList.innerHTML = ""; // Tar bort tidigare inloggningsmeddelanden

    let errors = [];
    let successMsg = [];
    try {
        const response = await fetch(`${url}api/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();
        // Vid misslyckat resultat
        if (!response.ok) {
            document.querySelector(".loading-spinner").classList.add("hidden"); // Visasr ingen laddningsikon
            showError(data.error); // Visar felmeddelanden från backend, ex upptagna användarnamn/email
            throw new Error(`Kunde inte hämta webbtjänsten...`);
            return;
        }
        // Vid lyckat resultat
        document.querySelector(".loading-spinner").classList.remove("hidden"); // Tar bort hidden för att visa laddningsikonen
        console.log("Ny användare skapad: ", data);
        errorMsgList.innerHTML = ""; // Raderar eventuella felmeddelanden från tidigare försök
        successMsg.push("Ny användare skapas!") // Meddelande i DOM att inloggningen gick bra
        displaySuccessMsg(successMsg); // Visar att inloggningen lyckades i DOM
        setTimeout(() => {
            document.querySelector(".loading-spinner").classList.add("hidden"); // Döljer ikonen
            successMsgList.innerHTML = "";
            window.location.href = "login.html"; // Skickar användaren till inloggningssidan
        }, 1000);
    } catch (error) {
        document.querySelector(".loading-spinner").classList.add("hidden");
        console.error("Kunde inte skapa en ny användare: ", error);
    }
}
// För att logga in en användare
async function loginUser() {
    // Inputs inom formuläret
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();
    const username = document.getElementById("login-username").value.trim();

    const errorMsgList = document.querySelector(".error-message ul"); // Felmeddelanden
    const successMsgList = document.querySelector(".success-message ul"); // Meddelanden vid lyckat resultat
    successMsgList.innerHTML = ""; // Tar bort tidigare inloggningsmeddelanden
    let errors = [];
    let successMsg = [];

    localStorage.removeItem("nyckel"); // Tar bort tidigare nyckel om det redan finns lagrat
    try {
        const response = await fetch(`${url}api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json(); // Väntar på responsen tillbaka
        const token = data.response.token; // Token utifrån data
        // Om token inte finns inom responsen så går inte inloggningen igenom
        if (!response.ok || !token) {
            document.querySelector(".loading-spinner").classList.add("hidden"); // Döljer ikonen vid misslyckad respons
            throw new Error("Kunde inte logga in användaren...");
            return;
        }
        console.log("Användare inloggad: ", data); // Felhantering
        localStorage.setItem("nyckel", token); // Sparar token i localstorage
        errorMsgList.innerHTML = ""; // Raderar eventuella felmeddelanden från tidigare försök
        document.querySelector(".loading-spinner").classList.remove("hidden"); // Tar bort hidden för att visa laddningsikonen
        // Visar ett felmeddelande i DOM vid lyckad inloggning
        successMsg.push("Inloggning lyckades!") // Meddelande i DOM att inloggningen gick bra
        displaySuccessMsg(successMsg); // Visar att inloggningen lyckades i DOM

        // Liten delay innan redirect för att hinna spara token i localstorage och visa laddningsikon en kort stund
        setTimeout(() => {
            document.querySelector(".loading-spinner").classList.add("hidden"); // Döljer ikonen efter redirect
            successMsgList.innerHTML = "";
            window.location.href = "protected.html";
        }, 1000);
    } catch (error) {
        console.error("Kunde inte logga in användaren: ", error);
        // Felmeddelanden i DOM
        errors.push("Kunde inte logga in...");
        errors.push("Fel email, lösenord eller användarnamn!");
        displayErrorMsg(errors); // Visar felmeddelanden
        return; // Kör inte vidare med inloggningen
    }
}

const menu = document.querySelector(".menu-list");

function changeLoginMenu() {
    if (localStorage.getItem("nyckel")) {
        menu.innerHTML = `
        <li><a class="current-page" href="/">Hem</a></li>
        <li><button id="logout-button">Logga ut</button></li>
        <li><a href="register.html">Registrera</a></li>
        `
    } else if (!localStorage.getItem("nyckel")) {
        menu.innerHTML = `
        <li><a href="/">Hem</a></li>
        <li><a href="login.html">Inloggning</a></li>
        `
    }

    const logoutBtn = document.getElementById("logout-button");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("nyckel");
            window.location.href = "login.html";
        });
    }
}