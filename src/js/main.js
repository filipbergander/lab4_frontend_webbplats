"use strict";

import '../sass/main.scss';
import { checkAuthAccess } from "./authentication/checkAuth.js";

// Global URL till webbtjänsten i backend
export const url = "http://localhost:3000/";

const menu = document.querySelector(".menu-list");

document.addEventListener("DOMContentLoaded", () => {
    fetchNews(); // Hämtar nyheter från backend
    changeLoginMenu(); // Ändrar navigeringsmenyn beroende på om användaren är inloggad eller inte
    addPageHighlight(); // Skiftar klass för länkar i navigeringsmenyn berorende på vilken sida man befinner sig på
    initRegisterForm(); // Lyssnar på ändringar i formuläret för att registrera en ny användare
    initLoginForm(); // Lyssnar på ändringar i formuläret för att logga in en ny användare
    initNewsForm(); // Lyssnar på ändringar i formuläret för att skapa ett nyhetsinlägg

    // Känner av och lyssnar på om man klickat på knappen med klassen delete-btn
    document.addEventListener("click", async(event) => {
        if (event.target.classList.contains("delete-btn")) {
            const btnId = event.target.dataset.id; // Hämtar det skapade dataset-id som respektive knapp fått
            // Confirm
            if (!confirm("Vill du verkligen radera inlägget?")) {
                return // Annars return vid -> avbryt
            }
            // Deletar ett inlägg genom funktionen om man klickat ok på att radera
            await deleteNews(btnId);
        }
    });
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

// Skapar och visar felmeddelanden som finns i backend(API), till frontend i DOM
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

// Lyssnar på ändringar som görs i formuläret, visar felmeddelanden i DOM och anropar funktionen för att skapa en ny användare
function initRegisterForm() {
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

}
// Lyssnar på ändringar som görs i formuläret, visar felmeddelanden i DOM och anropar funktionen för att logga in en användare
function initLoginForm() {
    // Formuläret med knapp för att logga in en användare
    const loginForm = document.getElementById("login-user-form");
    const loginBtn = document.getElementById("login-user-btn");

    // Eventlyssnare för inloggningsformuläret
    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            let errors = [];

            // Hämtar värden inom inloggningsformuläret
            const loginEmail = document.getElementById("login-email").value.trim();
            const loginPassword = document.getElementById("login-password").value.trim();
            // const loginUsername = document.getElementById("login-username").value.trim();

            // Specifika felmeddelande för inputs
            if (loginEmail === "") errors.push("Du måste fylla i email!");
            if (loginPassword === "") {
                errors.push("Du måste fylla i lösenord!")
            } else if (loginPassword.length < 6) {
                errors.push("Lösenordet måste vara minst 6 tecken!");
            }
            //if (loginUsername === "") errors.push("Du måste fylla i användarnamn!");
            // Om felmeddelanden finns visas dem genom funktionen displayErrorMsg
            if (errors.length > 0) {
                displayErrorMsg(errors);
                return; // Stoppar formuläret från att bli submittat
            } else {
                loginUser(); // Loggar in användaren genom funktionen
            }
        });
    }
}
// Lyssnar på ändringar som görs i formuläret, visar felmeddelanden i DOM och anropar funktionen för att skapa ett nytt inlägg
function initNewsForm() {
    // Formuläret med knapp för att skapa ett nytt nyhetsinlägg
    const newsForm = document.getElementById("add-news-form");
    const newsBtn = document.getElementById("add-news-btn");

    // Eventlyssnare för inloggningsformuläret
    if (newsForm) {
        newsForm.addEventListener("submit", (event) => {
            event.preventDefault();
            let errors = [];

            // Hämtar värden inom inloggningsformuläret
            const newsHeadline = document.getElementById("news-headline").value.trim();
            const newsContent = document.getElementById("news-content").value.trim();
            const newsAuthor = document.getElementById("news-author").value.trim();

            // Specifika felmeddelande för inputs
            if (newsHeadline === "") errors.push("Du måste fylla i rubrik!");
            if (newsContent === "") {
                errors.push("Skriv innehåll för nyheten!")
            } else if (newsContent.length < 10) {
                errors.push("Ett nyhetsinlägg behöver vara minst 10 tecken långt!");
            }
            if (newsAuthor < 3) errors.push("Du måste fylla i skribent, minst 3 tecken!");

            // Om felmeddelanden finns visas dem genom funktionen displayErrorMsg
            if (errors.length > 0) {
                displayErrorMsg(errors);
                return; // Stoppar formuläret från att bli submittat
            } else {
                createNews(); // Skapar ett nytt nyhetsinlägg
            }
        });
    }
}

// För att skapa ett nytt nyhetsinlägg
async function createNews() {
    // Hämtar värden inom inloggningsformuläret
    const headline = document.getElementById("news-headline").value.trim();
    const content = document.getElementById("news-content").value.trim();
    const author = document.getElementById("news-author").value.trim();

    const errorMsgList = document.querySelector(".error-message ul"); // Felmeddelanden
    const successMsgList = document.querySelector(".success-message ul"); // Meddelanden vid lyckat resultat
    successMsgList.innerHTML = ""; // Tar bort tidigare inloggningsmeddelanden

    const token = localStorage.getItem("nyckel"); // Finns token?

    let errors = [];
    let successMsg = [];
    // Skyddad route som anropas tillsammans med bearer + token
    try {
        const response = await fetch(`${url}api/news`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token

            },
            body: JSON.stringify({ headline, content, author })
        });
        const data = await response.json();
        // Vid misslyckat resultat
        if (!response.ok) {
            document.querySelector(".loading-spinner").classList.add("hidden"); // Visasr ingen laddningsikon
            //showError(data.error); // Visar felmeddelanden från backend
            throw Error(`Kunde inte skapa ett nytt inlägg...`);
            return;
        }
        // Vid lyckat resultat
        document.querySelector(".loading-spinner").classList.remove("hidden"); // Tar bort hidden för att visa laddningsikonen
        errorMsgList.innerHTML = ""; // Raderar eventuella felmeddelanden från tidigare försök
        successMsg.push("Inlägg skapat, publiceras!") // Meddelande för lyckad publicering av inlägg
        displaySuccessMsg(successMsg); // Visar meddelandet i DOM
        setTimeout(() => {
            document.querySelector(".loading-spinner").classList.add("hidden"); // Döljer ikonen
            successMsgList.innerHTML = ""; // Tar bort det lyckade meddelandet i DOM
            window.location.href = "index.html"; // Skickar användaren till startsidan med nyheterna
        }, 1000);
    } catch (error) {
        document.querySelector(".loading-spinner").classList.add("hidden");
        console.error("Kunde inte skapa ett nytt inlägg: ", error);
    }
}

// Hämtar nyhetsartiklar från databasservern
async function fetchNews() {
    const newsContainer = document.getElementById("news-container");
    if (!newsContainer) return;
    newsContainer.textContent = "Hämtar nyhetsartiklar från servern..."; // Meddelande innan nyhetsartiklar provat att hämtas in

    // Hämtar in nyheter från backend
    try {
        const response = await fetch(`${url}api/news`);
        if (!response.ok) {
            throw new Error(`Fel hos server, kunde inte hämta nyheter: ${response.status}`);
        }
        const newsArticles = await response.json();
        newsContainer.textContent = ""; // Tömmer tidigare nyhetsartiklar
        renderNews(newsArticles); // Renderar nyhetsartiklarna
    } catch (error) {
        console.error("Det gick inte att hämta nyhetsartiklar från servern: ", error);
        // Ifall användaren inte är inloggad visas ett felmeddelande
        newsContainer.textContent = "Kunde inte hämta nyhetsartiklar från servern. Registrera och logga in för att skapa ett nytt inlägg...";
        if (localStorage.getItem("nyckel")) { // Ifall användaren är inloggad visas ett annat felmeddelande
            newsContainer.textContent = "Kunde inte hämta nyhetsartiklar från servern. Prova skapa ett nytt inlägg.";
            newsContainer.style.color = "blue";
        }
    }
}

// Skapar nyhetsartiklar från de inhämtade nyhetsinläggen inom databasen
async function renderNews(newsArticles) {
    // Renderar inte nyheterna förens besökaren är på den sidan
    const newsContainer = document.getElementById("news-container");
    if (!newsContainer) return;

    // Tömmer listan av nyheter innan nya skapas
    newsContainer.innerHTML = "";

    const token = localStorage.getItem("nyckel");
    const loggedInTrue = !!token;

    // Skapar en rubrik
    let html = `<h2>Nyhetsinlägg för webbplatsen</h2>`
        // Fyller på med varje nyhetsartikel
    newsArticles.forEach(article => {
        html += `
<article class="news-article">
    <h3>${article.headline}</h3>
    <p class="p-content">${article.content}</p>
    <div class="article-created">
        <p><span><strong>Skribent:</strong></span> ${article.author}</p>
        <p><span><strong>Publicerat:</strong></span> ${article.created.date} kl: ${article.created.time}</p>
    </div>
    <div class="button-news">
`;
        // Stämmer det att man är inloggad? Lägger isåfall på radera-knapp inom inläggen
        if (loggedInTrue) {
            html += `<button data-id="${article.id}" class="delete-btn">Radera<span class="material-symbols-outlined">delete</span></button>`
        }
        // Oavsett om man är inloggad eller inte avslutas hela loopen
        html += `
    </div>
</article>
`;
    });
    // Lägger till alla artiklar inom containern
    newsContainer.innerHTML = html;
}

// Raderar ett nyhetsinlägg genom specifikt id på knapp
async function deleteNews(id) {
    const token = localStorage.getItem("nyckel"); // Token används för den skyddade routen
    try { // Försöker radera genom ID
        const response = await fetch(`${url}api/news/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw Error(`Kunde inte radera inlägget...`)
            return;
        }
        // Hämtar inläggen från databasen igen efter att ett inlägg tagits bort
        fetchNews();
    } catch (error) {
        console.error("Fel när inlägget skulle raderas: ", error);
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
    // Skapar en ny användare genom routen i backend
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
            throw Error(`Kunde inte skapa en ny användare...`);
            return;
        }
        // Vid lyckat resultat
        document.querySelector(".loading-spinner").classList.remove("hidden"); // Tar bort hidden för att visa laddningsikonen
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
    //const username = document.getElementById("login-username").value.trim();

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
            body: JSON.stringify({ email, password })
        });

        const data = await response.json(); // Väntar på responsen tillbaka
        const token = data.response.token; // Token utifrån data
        // Om token inte finns inom responsen så går inte inloggningen igenom
        if (!response.ok || !token) {
            document.querySelector(".loading-spinner").classList.add("hidden"); // Döljer ikonen vid misslyckad respons
            throw new Error("Kunde inte logga in användaren...");
            return;
        }
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
            window.location.href = "admin.html";
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
// För att switcha navigeringsmenyn beroende på om man är inloggad eller inte
function changeLoginMenu() {
    // Om man är inloggad
    if (localStorage.getItem("nyckel")) {
        menu.innerHTML = `
        <li><a href="index.html">Hem</a></li>
        <li><a href="admin.html">Inlägg</a></li>
        <li><button id="logout-button">Logga ut</button></li>
        `
            // Om man inte är inloggad
    } else if (!localStorage.getItem("nyckel")) {
        menu.innerHTML = `
        <li><a href="index.html">Hem</a></li>
        <li><a href="login.html">Logga in</a></li>
        <li><a href="register.html">Registrera</a></li>
        `
    }
    // Logga ut knapp
    const logoutBtn = document.getElementById("logout-button");
    // Om knappen finns tillgänglig -> om användaren är inloggad
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("nyckel"); // Tar bort key från localstorage
            window.location.href = "login.html"; // Navigerar användaren till login-sidan
        });
    }
}
// Lägger på klassen current-page på aktuell sida för användaren, för att kunna styla
function addPageHighlight() {
    // Vilken sida som användare är på, hämtar in filnamnet och tar bort /, vid tom sträng används index.html annars aktuell sida t.ex login.html
    const currentLocation = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".menu-list a"); // Hämtar in alla länkar som finns i huvudmenyn
    // Loop
    navLinks.forEach(link => {
        const linkLocation = link.getAttribute("href").split("/").pop() || "index.html"; //Hämtar in motsvarande href-värde från aktuell länk

        // Om länkens filnamn matchar med href-värdet
        if (currentLocation === linkLocation) {
            link.classList.add("current-page"); // Lägger på klassen inom länken
        }
    });
}