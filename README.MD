# Laboration 4 - Webbplats | Backend-baserad webbutveckling (Frontend)

Jag skapar inom denna uppgift en frontend-webbplats som använder en webbtjänst i backend för att registrera och logga in användarkonton samt posta och radera nyhetsinlägg.
Webbplatsen skapades med HTML, Sass (SCSS), samt JavaScript och VITE.

**Webbplats:** https://fb-lab4-backend.netlify.app/  

Data hämtas in och skapas genom webbtjänsten med Fetch API. Felhantering görs i formulär och skrivs ut i DOM för besökaren. Exempelvis när man ska skapa ett användarkonto.
För att anropa skyddade routes krävs det inloggning. När en användare loggar in lagras en JWT (*Json Web Token*) samt användarnamnet i localStorage. JWT används som ett krav mot webbtjänstens skyddade routes, vilket skickas inom Header -> Authorization i anropet. Till exempel:

![Visar kod för ett Fetch-anrop mot skyddad route](<carbon (1).png>) 
 
Navigeringsmenyn samt sidor skiljer sig beroende på om man är inloggad eller inte.  
Sidor som finns när en användare inte är inloggad:

- **Hem:** Presentation av webbplatsen samt nyhetsinlägg.
- **Logga in:** Möjlighet att logga in en befintlig användare genom formulär.
- **Registrera:** Möjlighet att skapa nya användare genom formulär.

Sidor vid inloggning:
- **Hem:** Lägger till en radera-knapp för befintliga nyhetsinlägg.
- **Inlägg:** Möjlighet att skapa nyhetsinlägg på startsidan genom formulär, användarnamn visas i en display.
- **Logga ut** Knapp för att logga ut användaren. JWT & användarnamn tas i samma veva bort från localStorage.

Inlägg-sidan är till för administratörer, vilket man blir när man registrerar ett konto. Möjligheten att skapa ett nyhetsinlägg görs inom denna sida med en skyddad route mot webbtjänsten. 

## Övrigt
MongoDB och Atlas används som databas inom webbtjänsten. Hosten är Render. Render går ned i ett viloläge när tjänsten inte anropats på ett tag. När en användare besöker hemsidan visas ett meddelande på startsidan: "Hämtar nyhetsartiklar från servern...". Vilket indikerar på att det tar lite tid för att allt ska laddas in.

Funktion skapades för att säkerställa om användaren hade behörighet att se skyddade routes eller inte. Ifall ingen JWT lagrades i localStorage, var det inte möjligt att navigera till admin-sidan.

Laddningsikoner för lyckade anrop till formulären skapades för att förtydliga. Det var intressant att experimentera med felmeddelanden, både från backend och frontend för att kunna presentera i DOM.

*Filip Bergander | Laboration 4 - Backend-baserad Webbutveckling - Mittuniversitet 2026*