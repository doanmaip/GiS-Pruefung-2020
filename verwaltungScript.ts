inizializeVerwaltung();

async function inizializeVerwaltung (): Promise<void> {
    await getItemsVerwaltung();
    createVerwaltungItems();
}

async function getItemsVerwaltung (): Promise<void> {
    let response: Response = await fetch("http://127.0.0.1:8100/gegenstaende");
    items = await response.json();
    console.log(items);
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
        if(items[i].status === "ausgeliehen"){
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
        if(items[i].status === "frei"){
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
    let url: string = `http://127.0.0.1:8100/statusAusgeliehen/${item._id}`;
    console.log(url);
    await fetch(url);
    window.location.href = "http://127.0.0.1:5500/verwaltung.html";
}

async function statusFrei(this: HTMLElement): Promise<void> {
    let item: Gegenstand = items.find(gegestand => gegestand.titel === this.parentElement.children[1].innerHTML);
    let url: string = `http://127.0.0.1:8100/statusFrei/${item._id}`;
    console.log(url);
    await fetch(url);
    window.location.href = "http://127.0.0.1:5500/verwaltung.html";
}

