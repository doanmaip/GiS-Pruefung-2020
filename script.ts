
inizialize();
localStorage.clear();

async function inizialize (): Promise<void> {
    await getItems();
    createItems();
}

async function getItems (): Promise<void> {
    let response: Response = await fetch("https://asta-gis-2021.herokuapp.com/gegenstaende");
    items = await response.json();
}

function createItems (): void {
    for (let i: number = 0; i < items.length; i++) {
        let newDiv: HTMLDivElement = document.createElement("div");
        if (items[i].kategorie === "technik") {
            document.getElementById("technikProducts").append(newDiv);
        } else if (items[i].kategorie === "spiele") {
            document.getElementById("spieleProducts").append(newDiv);
        } else if (items[i].kategorie === "sonstiges") {
            document.getElementById("sonstigesProducts").append(newDiv);
        }

        newDiv.className = items[i].status;
        newDiv.id = i.toString();
        //TODO andere Kategorien hinzufügen

        let kategorie: HTMLParagraphElement = document.createElement("p");
        kategorie.innerHTML = items[i].kategorie;
        kategorie.className = "preheadline";

        //macht image Tag und setzt source und titel dynamisch
        let image: HTMLImageElement = document.createElement("img");
        image.src = items[i].img;
        image.alt = items[i].titel;

        //h2 Tag erstellt und innerHTML gesetzt
        let h2: HTMLHeadingElement = document.createElement("h2");
        h2.innerHTML = items[i].titel;

        //p description Tag erstellt und innerHTML gesetzt
        let descriptionP: HTMLParagraphElement = document.createElement("p");
        descriptionP.innerHTML = items[i].beschreibung;

        let ausleigebuehrP: HTMLParagraphElement = document.createElement("p");
        ausleigebuehrP.innerHTML = "Ausleihgebühr: € ";

        let strong: HTMLElement = document.createElement("strong");
        strong.innerHTML = items[i].price.toString();

        ausleigebuehrP.append(strong);

        let button: HTMLButtonElement = document.createElement("button");
        button.type = "button";
        button.className = "button";
        button.innerHTML = "Artikel reservieren";

        button.addEventListener("click", reservieren);
        if (items[i].status === "ausgeliehen" || items[i].status === "ausgeliehen" ) {
            button.disabled = true;
        }

        newDiv.append(image);
        newDiv.append(kategorie);
        newDiv.append(h2);
        newDiv.append(descriptionP);
        newDiv.append(ausleigebuehrP);
        newDiv.append(button);
    }

    function reservieren(this: HTMLButtonElement, _event: Event): void {
        let parentDiv: HTMLElement = this.parentElement;
        parentDiv.className = "ausgewaehlt";

        let gegestand: Gegenstand = items[Number.parseInt(<string>this.parentElement?.id)];
        let priceTag: HTMLElement = document.getElementById("preis");
        let aktuellerPrice: number = Number.parseInt(priceTag.innerHTML) ;  

        let neuerPrice: number = aktuellerPrice + gegestand.price;
    
        priceTag.innerHTML = neuerPrice.toString();

        let reservierung: Reservierung = {ids: []};
        if (localStorage.getItem("reservierungen")) {
            reservierung = JSON.parse(localStorage.getItem("reservierungen"));
            reservierung.ids.push(gegestand._id);
        } else {
            reservierung.ids.push(gegestand._id);
        }
        localStorage.setItem("reservierungen", JSON.stringify(reservierung));

        this.disabled = true;
    }
}
