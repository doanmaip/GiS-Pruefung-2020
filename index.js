"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Http = require("http");
const Url = require("url");
const Mongo = require("mongodb");
let port = Number(process.env.Port);
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
    console.log(req.method);
    if (req.method === "GET") {
        if (req.url) {
            let url = Url.parse(req.url, true);
            if (url.pathname === "/gegenstaende") {
                getItems(res);
            }
        }
    }
}
async function getItems(res) {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    let itemsCursor = await itemsCollection.find();
    let itemsArray = await itemsCursor.toArray();
    res.write(JSON.stringify(itemsArray));
    res.end();
}
//# sourceMappingURL=index.js.map