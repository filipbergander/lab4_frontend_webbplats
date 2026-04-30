import '../sass/main.scss';

export const url = "http://localhost:3000/";

document.addEventListener("DOMContentLoaded", () => {
    createUser();
});

async function createUser() {
    try {
        const response = await fetch(`${url}`, {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error(`Kunde inte hämta webbtjänsten...`);
        }
        console.log("Respons från webbtjänst: ", response);
    } catch (error) {
        console.error("Gick inte att hämta data från webbtjänsten: ", error)
    }
}

async function loginUser() {
    try {

    } catch (error) {

    }
}