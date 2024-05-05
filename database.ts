import { Collection, MongoClient } from "mongodb";
import dotenv from "dotenv";
import { Game } from "./interfaces";
dotenv.config();

const uri = "mongodb+srv://EdisonTsang:s115239@webontwikkeling-cluster.7vlvp9o.mongodb.net/";
export const client = new MongoClient(uri);

/*const dbName = 'gamesDB';
const collectionName = 'games';*/

export const collection : Collection<Game> = client.db("Project").collection<Game>("games");

export async function getGames() {
    try {
        return await collection.find({}).toArray();
    } catch (error) {
        console.error("Fout bij het ophalen van games:", error);
        const response = await fetch("https://raw.githubusercontent.com/EdisonTsang/jsonHost/main/games.json");
        const games : Game[] = await response.json();
        return games;
    }
}

async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

export async function loadGamesFromApi() {
    const games : Game[] = await getGames();
    console.log(games);
    if (games.length == 0) {
        console.log("Database is empty, loading games from API")
        const response = await fetch("https://raw.githubusercontent.com/EdisonTsang/jsonHost/main/games.json");
        const games : Game[] = await response.json();
        await collection.insertMany(games);
    }
}

export async function connect() {
    try {
        await client.connect();
        await loadGamesFromApi();   
        console.log("Connected to database");
        process.on("SIGINT", exit);
    } catch (error) {
        console.error(error);
    }
}