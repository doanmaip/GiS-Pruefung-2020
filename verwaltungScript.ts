inizializeVerwaltung();

async function inizializeVerwaltung (): Promise<void> {
    await getItemsVerwaltung();
    createVerwaltungItems();
}

async function getItemsVerwaltung (): Promise<void> {
    let response: Response = await fetch("http://asta-gis-2021.herokuapp.com/gegenstaende");
    items = await response.json();
}

function createVerwaltungItems(): void {
    let itemsContainer: HTMLDivElement = <HTMLDivElement>document.getElementById("status");

    for (let i: number = 0; i < items.length; i++) {
        let itemDiv: HTMLDivElement = document.createElement("div");

        let preheadline: HTMLParagraphElement = document.createElement("p");
        preheadline.className = "preheadline";
        preheadline.innerHTML = items[i].kategorie;

        let artikelName: HTMLHeadingElement = document.createElement("h2");
        artikelName.innerHTML = items[i].titel;

        let status: HTMLParagraphElement = document.createElement("p");
        status.innerHTML = "Status: " + items[i].status; 
        
        let ausgeliehen: HTMLParagraphElement = document.createElement("p");
        if (items[i].status === "ausgeliehen") {
            ausgeliehen.innerHTML = "Ausgeliehen von: " + items[i].ausgeliehenAn;
        } else if (items[i].status === "reserviert") {
            ausgeliehen.innerHTML = "Reserviert von: " + items[i].ausgeliehenAn;
        }
        
        let ausgeliehenbtn: HTMLButtonElement = document.createElement("button");
        ausgeliehenbtn.innerHTML = "Auf ausgeliehen setzen"; 
        ausgeliehenbtn.className = "button";
        ausgeliehenbtn.addEventListener("click", statusAusgehliehen);

        
        let freibtn: HTMLButtonElement = document.createElement("button");
        freibtn.innerHTML = "Auf frei setzen"; 
        freibtn.className = "button";
        freibtn.addEventListener("click", statusFrei);
        
        itemDiv.append(preheadline);
        if (items[i].status === "frei") {
            ausgeliehenbtn.disabled = true;
            freibtn.disabled = true;
        } else if (items[i].status === "reserviert") {
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

async function statusAusgehliehen(this: HTMLElement): Promise<void> {
    let item: Gegenstand = items.find(gegestand => gegestand.titel === this.parentElement.children[1].innerHTML);
    let url: string = "http://asta-gis-2021.herokuapp.com/statusAusgeliehen/" + item._id;
    await fetch(url);
    window.location.href = "http://doanmaip.github.io/GiS-Pruefung-2020/verwaltung.html";
}

async function statusFrei(this: HTMLElement): Promise<void> {
    let item: Gegenstand = items.find(gegestand => gegestand.titel === this.parentElement.children[1].innerHTML);
    let url: string = "http://asta-gis-2021.herokuapp.com/statusFrei/" + item._id;
    await fetch(url);
    window.location.href = "http://doanmaip.github.io/GiS-Pruefung-2020/verwaltung.html";
}

