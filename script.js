"use strict";
inizialize();
localStorage.clear();
async function inizialize() {
    await getItems();
    createItems();
}
async function getItems() {
    let response = await fetch("https://asta-gis-2021.herokuapp.com/gegenstaende");
    items = await response.json();
}
function createItems() {
    for (let i = 0; i < items.length; i++) {
        let newDiv = document.createElement("div");
        if (items[i].kategorie === "technik") {
            document.getElementById("technikProducts").append(newDiv);
        }
        else if (items[i].kategorie === "spiele") {
            document.getElementById("spieleProducts").append(newDiv);
        }
        else if (items[i].kategorie === "sonstiges") {
            document.getElementById("sonstigesProducts").append(newDiv);
        }
        newDiv.className = items[i].status;
        newDiv.id = i.toString();
        let kategorie = document.createElement("p");
        kategorie.innerHTML = items[i].kategorie;
        kategorie.className = "preheadline";
        let image = document.createElement("img");
        image.src = items[i].img;
        image.alt = items[i].titel;
        let h2 = document.createElement("h2");
        h2.innerHTML = items[i].titel;
        let descriptionP = document.createElement("p");
        descriptionP.innerHTML = items[i].beschreibung;
        descriptionP.className = "text-box";
        let ausleigebuehrP = document.createElement("p");
        ausleigebuehrP.innerHTML = "Ausleihgebühr: ";
        ausleigebuehrP.className = "preis";
        let strong = document.createElement("strong");
        strong.innerHTML = items[i].price.toString();
        ausleigebuehrP.append(strong);
        let button = document.createElement("button");
        button.type = "button";
        button.className = "button";
        button.innerHTML = "Artikel reservieren";
        button.addEventListener("click", reservieren);
        if (items[i].status === "ausgeliehen" || items[i].status === "ausgeliehen") {
            button.disabled = true;
        }
        newDiv.append(image);
        newDiv.append(kategorie);
        newDiv.append(h2);
        newDiv.append(descriptionP);
        newDiv.append(ausleigebuehrP);
        newDiv.append(button);
    }
    function reservieren(_event) {
        let parentDiv = this.parentElement;
        parentDiv.className = "ausgewaehlt";
        let gegestand = items[Number.parseInt(this.parentElement?.id)];
        let priceTag = document.getElementById("preis");
        let aktuellerPrice = Number.parseInt(priceTag.innerHTML);
        let neuerPrice = aktuellerPrice + gegestand.price;
        priceTag.innerHTML = neuerPrice.toString();
        let reservierung = { ids: [] };
        if (localStorage.getItem("reservierungen")) {
            reservierung = JSON.parse(localStorage.getItem("reservierungen"));
            reservierung.ids.push(gegestand._id);
        }
        else {
            reservierung.ids.push(gegestand._id);
        }
        localStorage.setItem("reservierungen", JSON.stringify(reservierung));
        this.disabled = true;
    }
}
//# sourceMappingURL=script.js.map