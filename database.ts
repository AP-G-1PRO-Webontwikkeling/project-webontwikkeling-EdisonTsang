import { Collection, MongoClient } from "mongodb";
import dotenv from "dotenv";
import { Developer, Game } from "./interfaces";
import test from "node:test";
dotenv.config();

const uri = "mongodb+srv://EdisonTsang:s115239@webontwikkeling-cluster.7vlvp9o.mongodb.net/";
const client = new MongoClient(uri);

export const gamesCollection : Collection<Game> = client.db("Project").collection<Game>("games");
export const developersCollection : Collection<Developer> = client.db("Project").collection<Developer>("developers");


export async function getGames() {
    return await gamesCollection.find().toArray();
}

export async function getDevelopers() {
    return await developersCollection.find().toArray();
}

export async function updateGameTitle(gameId: string, title: string) {
    await gamesCollection.updateOne({ id: gameId }, { $set: { name: title } });
  }

  export async function updateGameDate(gameId: string, releaseDate: string) {
    await gamesCollection.updateOne({ id: gameId }, { $set: { releaseDate: releaseDate } });
  }  

  export async function updateGamePlatforms(gameId: string, platforms: string[]) {
    await gamesCollection.updateOne({ id: gameId }, { $set: { platforms: platforms } });
}

  export async function updateGameGenre(gameId: string, genre: string) {
    await gamesCollection.updateOne({ id: gameId }, { $set: { genre: genre } });
  }  
  
  export async function DeleteCollection() {
    const result = await gamesCollection.deleteMany();
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
    if (await gamesCollection.countDocuments() === 0) {
        const response = await fetch("https://raw.githubusercontent.com/EdisonTsang/jsonHost/main/games.json");
        const games : Game[] = await response.json();
        await gamesCollection.insertMany(games);
    }
}

export async function loadDevelopersFromApi() {
    const developer : Developer[] = await getDevelopers();
    if (await developersCollection.countDocuments() === 0) {
        const response = await fetch("https://raw.githubusercontent.com/EdisonTsang/jsonHost/main/developers.json");
        const developers : Developer[] = await response.json();
        await developersCollection.insertMany(developers);
    }
}

export async function connect() {
    try {
        await client.connect();
        await loadGamesFromApi();   
        await loadDevelopersFromApi();
        console.log("Connected to database");
        process.on("SIGINT", exit);
    } catch (error) {
        console.error(error);
    }
}