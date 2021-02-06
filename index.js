"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Http = require("http");
const Url = require("url");
const Mongo = require("mongodb");
let port = Number(process.env.PORT);
let databaseUrl = "mongodb+srv://asta:passwort@cluster0.jvb9m.mongodb.net/Asta?retryWrites=true&w=majority";
let itemsCollection;
if (!port) {
    port = 8100;
}
serverInit(port);
async function serverInit(_port) {
    let server = Http.createServer();
    await connectToDB(databaseUrl);
    server.addListener("request", handleRequest);
    server.addListener("listening", function () {
        console.log("listening on Port: " + _port);
    });
    server.listen(_port);
}
async function connectToDB(_url) {
    let mongoClient = new Mongo.MongoClient(_url, { useUnifiedTopology: true });
    await mongoClient.connect();
    if (mongoClient.isConnected()) {
        console.log("DB is connected");
    }
    itemsCollection = mongoClient.db("Asta").collection("Sortiment");
}
async function handleRequest(req, res) {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.method === "POST") {
        handleReservierung(req, res);
    }
    else if (req.method === "GET") {
        if (req.url) {
            let url = Url.parse(req.url, true);
            let urlSplit = url.pathname.split("/");
            if (url.pathname === "/gegenstaende") {
                getItems(res);
            }
            else if (urlSplit[1] === "statusFrei") {
                updateStatusFrei(res, urlSplit);
            }
            else if (urlSplit[1] === "statusAusgeliehen") {
                updateStatusAusgeliehen(res, urlSplit);
            }
        }
    }
}
async function getItems(res) {
    let itemsCursor = await itemsCollection.find();
    let itemsArray = await itemsCursor.toArray();
    res.write(JSON.stringify(itemsArray));
    res.end();
}
async function handleReservierung(req, res) {
    let body = "";
    req.on("data", chunk => {
        body += chunk.toString();
    });
    req.on("end", async () => {
        let reservierung = JSON.parse(body);
        await updateDbReservierungen(res, reservierung);
        res.end();
    });
}
async function updateDbReservierungen(res, reservierung) {
    for (let i = 0; i < reservierung.ids.length; i++) {
        let id = new Mongo.ObjectID(reservierung.ids[i].toString());
        itemsCollection.updateOne({ "_id": id }, { $set: { "status": "reserviert", "ausgeliehenAn": reservierung.name } });
    }
    res.end();
}
async function updateStatusFrei(res, urlSplit) {
    let id = new Mongo.ObjectId(urlSplit[2]);
    itemsCollection.updateOne({ "_id": id }, { $set: { "status": "frei", "ausgeliehenAn": "" } });
    res.end();
}
async function updateStatusAusgeliehen(res, urlSplit) {
    let id = new Mongo.ObjectId(urlSplit[2]);
    itemsCollection.updateOne({ "_id": id }, { $set: { "status": "ausgeliehen" } });
    res.end();
}
//# sourceMappingURL=index.js.map