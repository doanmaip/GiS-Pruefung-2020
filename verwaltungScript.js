"use strict";
inizializeVerwaltung();
async function inizializeVerwaltung() {
    await getItemsVerwaltung();
    createVerwaltungItems();
}
async function getItemsVerwaltung() {
    let response = await fetch("http://asta-gis-2021.herokuapp.com/gegenstaende");
    items = await response.json();
}
function createVerwaltungItems() {
    let itemsContainer = document.getElementById("status");
    for (let i = 0; i < items.length; i++) {
        let itemDiv = document.createElement("div");
        let preheadline = document.createElement("p");
        preheadline.className = "preheadline";
        preheadline.innerHTML = items[i].kategorie;
        let artikelName = document.createElement("h2");
        artikelName.innerHTML = items[i].titel;
        let status = document.createElement("p");
        status.innerHTML = "Status: " + items[i].status;
        let ausgeliehen = document.createElement("p");
        if (items[i].status === "ausgeliehen") {
            ausgeliehen.innerHTML = "Ausgeliehen von: " + items[i].ausgeliehenAn;
        }
        else if (items[i].status === "reserviert") {
            ausgeliehen.innerHTML = "Reserviert von: " + items[i].ausgeliehenAn;
        }
        let ausgeliehenbtn = document.createElement("button");
        ausgeliehenbtn.innerHTML = "Auf ausgeliehen setzen";
        ausgeliehenbtn.className = "button";
        ausgeliehenbtn.addEventListener("click", statusAusgehliehen);
        let freibtn = document.createElement("button");
        freibtn.innerHTML = "Auf frei setzen";
        freibtn.className = "button";
        freibtn.addEventListener("click", statusFrei);
        itemDiv.append(preheadline);
        if (items[i].status === "frei") {
            ausgeliehenbtn.disabled = true;
            freibtn.disabled = true;
        }
        else if (items[i].status === "reserviert") {
            freibtn.disabled = true;
        }
        itemDiv.append(artikelName);
        itemDiv.append(status);
        itemDiv.append(ausgeliehen);
        itemDiv.append(ausgeliehenbtn);
        itemDiv.append(freibtn);
        itemsContainer.append(itemDiv);
    }
}
async function statusAusgehliehen() {
    let item = items.find(gegestand => gegestand.titel === this.parentElement.children[1].innerHTML);
    let url = "http://asta-gis-2021.herokuapp.com/statusAusgeliehen/" + item._id;
    await fetch(url);
    window.location.href = "http://doanmaip.github.io/GiS-Pruefung-2020/verwaltung.html";
}
async function statusFrei() {
    let item = items.find(gegestand => gegestand.titel === this.parentElement.children[1].innerHTML);
    let url = "http://asta-gis-2021.herokuapp.com/statusFrei/" + item._id;
    await fetch(url);
    window.location.href = "http://doanmaip.github.io/GiS-Pruefung-2020/verwaltung.html";
}
//# sourceMappingURL=verwaltungScript.js.map