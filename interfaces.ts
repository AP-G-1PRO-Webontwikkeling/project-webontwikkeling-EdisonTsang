/*export interface Developer {
    id: string;
    name: string;
    isActive: boolean;
    gamesPublished: number;
  }*/
  
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
    developers: {
      id: string;
      Name: string;
      IsActive: boolean;
      gamesPublished: number;
    };
  }
  