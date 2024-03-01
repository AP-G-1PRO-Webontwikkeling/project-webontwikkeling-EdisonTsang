import gamesData from './games.json';
import developerData from './developers.json';
import { Game } from './interfaces';
import * as readline from 'readline-sync';

async function ConsoleApp() {
    
    const response = await fetch("https://raw.githubusercontent.com/EdisonTsang/jsonHost/main/games.json");
    const games: Game[] = await response.json();

    function findGameById(id: string): Game | undefined {
        return games.find((game) => game.id === id);
      }   
    let again:boolean = true;
    
    while(again){
        console.log('Welcome to the JSON data viewer!');
        console.log('1. View all data');
        console.log('2. Filter by ID');
        console.log('3. Exit');3
        
        let choice:number = readline.questionInt("Please enter your choice: ");
        
        if(choice === 1){
            games.forEach((game) => {
                console.log(`- ${game.name}  (${game.id})`);
                console.log('.................................');
                console.log();
              });
        } else if (choice === 2){
            let inputId: string = readline.question("Please enter the ID you want to filter by: ")
            console.log();
            const chosenGame = findGameById(inputId);
    
            if (chosenGame) {
                console.log(`- ${chosenGame.name}  (${chosenGame.id})`);
                console.log(`- Description: ${chosenGame.description}`);
                console.log(`- Age: ${chosenGame.age}`);
                console.log(`- Multiplayer: ${chosenGame.multiplayer}`);
                console.log(`- Releasedate: ${chosenGame.releaseDate}`);
                console.log(`- Genre: ${chosenGame.genre}`);
                console.log(`- Platforms: ${chosenGame.platforms}`);
                console.log(`- Developer: ${chosenGame.developers.name}:`);
                console.log(`  - IsActive: ${chosenGame.developers.isActive}`);
                console.log(`  - GamesPublished: ${chosenGame.developers.gamesPublished}`);
                console.log("");
              } else {
                console.log(`No game is found with this id`);
                console.log("");
              }
        }
        else{
        again = false;
        }
    }
}

ConsoleApp();




