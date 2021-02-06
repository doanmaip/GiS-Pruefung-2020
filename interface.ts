interface Gegenstand {
    _id: number;
    img: string;
    kategorie: string;
    titel: string;
    price: number;
    beschreibung: string; 
    status: string;
    ausgeliehenAn: string;
}

interface Reservierung {
    ids: number[];
    name?: string;
}

let items: Gegenstand[] = [];