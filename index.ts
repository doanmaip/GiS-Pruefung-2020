import * as Http from "http";
import * as Url from "url";
import * as Mongo from "mongodb";


let port: number = Number (process.env.PORT);
let databaseUrl: string = "mongodb+srv://asta:passwort@cluster0.jvb9m.mongodb.net/Asta?retryWrites=true&w=majority";
let itemsCollection: Mongo.Collection;


if (!port) {
    port = 8100;
}

serverInit(port);

async function serverInit (_port: number): Promise<void> {
    let server: Http.Server = Http.createServer();
    await connectToDB(databaseUrl);
    
    server.addListener("request", handleRequest);
    
    server.addListener("listening", function (): void {
        console.log("listening on Port: " + _port);
    });

    server.listen(_port);
}

async function connectToDB (_url: string): Promise<void> {
    let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(_url, { useUnifiedTopology: true });
    await mongoClient.connect();
    
    if (mongoClient.isConnected()) {
        console.log("DB is connected");
    }

    itemsCollection = mongoClient.db("Asta").collection("Sortiment");
}

async function handleRequest (req: Http.IncomingMessage, res: Http.ServerResponse): Promise<void> {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.method === "POST") {
        handleReservierung(req, res);
    } else if (req.method === "GET") {
        if (req.url) {
            let url: Url.UrlWithParsedQuery = Url.parse(req.url, true);
            let urlSplit: string[] = url.pathname.split("/");
            
            if (url.pathname === "/gegenstaende") {
                getItems(res);
            } else if (urlSplit[1] === "statusFrei") {
                updateStatusFrei(res, urlSplit);
            } else if (urlSplit[1] === "statusAusgeliehen") {
                updateStatusAusgeliehen(res, urlSplit);
            }
        }
    }
}

async function getItems (res: Http.ServerResponse): Promise<void> {
    let itemsCursor: Mongo.Cursor<string> = await itemsCollection.find();
    let itemsArray: string[] = await itemsCursor.toArray();
    res.write(JSON.stringify(itemsArray));
    res.end();
}

async function handleReservierung (req: Http.IncomingMessage, res: Http.ServerResponse): Promise<void> {

    let body: string = "";
    req.on("data", chunk => {
        body += chunk.toString();
    });
    req.on("end", async () => {
        let reservierung: Reservierung = JSON.parse(body);
        await updateDbReservierungen(res, reservierung);
        res.end();
    });
}

async function updateDbReservierungen (res: Http.ServerResponse, reservierung: Reservierung): Promise<void> {
    for (let i: number = 0; i < reservierung.ids.length; i++) {
        let id: Mongo.ObjectID = new Mongo.ObjectID(reservierung.ids[i].toString());
        itemsCollection.updateOne({"_id": id}, {$set: {"status": "reserviert", "ausgeliehenAn": reservierung.name}});
    }
    res.end();
}

async function updateStatusFrei (res: Http.ServerResponse, urlSplit: string[]): Promise<void> {
    let id: Mongo.ObjectId = new Mongo.ObjectId(urlSplit[2]);
    itemsCollection.updateOne({"_id": id}, {$set: {"status": "frei", "ausgeliehenAn": ""}} );
    res.end();
}

async function updateStatusAusgeliehen (res: Http.ServerResponse, urlSplit: string[]): Promise<void> {
    let id: Mongo.ObjectId = new Mongo.ObjectId(urlSplit[2]);
    itemsCollection.updateOne({"_id": id}, {$set: {"status": "ausgeliehen"}});
    res.end();
}