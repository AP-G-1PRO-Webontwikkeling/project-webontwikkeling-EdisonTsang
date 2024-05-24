  import { ObjectId } from "mongodb";

  export interface Developer {
    id: string;
    name: string;
    isActive: boolean;
    gamesPublished: number;
  }
  
  export interface Game {
    id: string;
    name: string;
    description: string;
   age: number;
    multiplayer: boolean;
    releaseDate: string;
   imageUrl: string;
   genre: string;
   platforms: string[];
    developers: Developer;
    }
  
    export interface User {
      _id?: ObjectId;
      email: string;
      password?: string;
      role: "ADMIN" | "USER";
  }