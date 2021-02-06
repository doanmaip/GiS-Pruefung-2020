import * as Http from "http";
import * as Url from "url";
import * as Mongo from "mongodb";


let port: number = Number (process.env.Port);
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
    console.log(req.method);
    if (req.method === "GET") {
        if (req.url) {
            let url: Url.UrlWithParsedQuery = Url.parse(req.url, true);
            
            if (url.pathname === "/gegenstaende") {
                getItems(res);
            }
        }
    }
}

async function getItems (res: Http.ServerResponse): Promise<void> {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    let itemsCursor: Mongo.Cursor<string> = await itemsCollection.find();
    let itemsArray: string[] = await itemsCursor.toArray();
    res.write(JSON.stringify(itemsArray));
    res.end();
}
