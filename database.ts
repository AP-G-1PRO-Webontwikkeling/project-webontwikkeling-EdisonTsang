import { Collection, MongoClient } from "mongodb";
import dotenv from "dotenv";
import { Developer, Game, User } from "./interfaces";
import bcrypt from 'bcrypt'; 

dotenv.config();
const saltRounds : number = 10;

export const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017";
export const client = new MongoClient(MONGODB_URI);

export const gamesCollection : Collection<Game> = client.db("Project").collection<Game>("games");
export const developersCollection : Collection<Developer> = client.db("Project").collection<Developer>("developers");
export const usersCollection: Collection<User> = client.db("Project").collection<User>("users");

export async function createUser() {
    const userExists = await usersCollection.findOne({ role: "USER" });

    if (userExists) {
        console.log("Er is een bestaande user");
        return;
        
    }
    else{
        let email : string | undefined = process.env.USER_EMAIL;
        let password : string | undefined = process.env.USER_PASSWORD;
        if (email === undefined || password === undefined) {
            throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment");
        }
        await usersCollection.insertOne({
            email: email,
            password: await bcrypt.hash(password, saltRounds),
            role: "USER"
        });
        console.log("user aangemaakt");
    }
}

export async function createAdmin() {
    const adminExists = await usersCollection.findOne({ role: "ADMIN" });
    if (adminExists) {
        console.log("Er is een bestaande admin");
        return;
    }
    else{
        let email : string | undefined = process.env.ADMIN_EMAIL;
        let password : string | undefined = process.env.ADMIN_PASSWORD;
        if (email === undefined || password === undefined) {
            throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment");
        }
        await usersCollection.insertOne({
            email: email,
            password: await bcrypt.hash(password, saltRounds),
            role: "ADMIN"
        });
        console.log("admin aangemaakt");

    }
}

export async function login(email: string, password: string) {
    if (email === "" || password === "") {
        throw new Error("Email and password required");
    }
    let user : User | null = await usersCollection.findOne<User>({email: email});
    if (user) {
        if (await bcrypt.compare(password, user.password!)) {
            return user;
        } else {
            throw new Error("Password incorrect");
        }
    } else {
        throw new Error("User not found");
    }
}

export async function userExists(email: string): Promise<boolean> {
    const existingUser = await usersCollection.findOne({ email });
    return existingUser !== null;
}

export async function registerUser(email: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser: User = { 
        email, 
        password: hashedPassword, 
        role: 'USER' 
    };
    await usersCollection.insertOne(newUser);
}


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