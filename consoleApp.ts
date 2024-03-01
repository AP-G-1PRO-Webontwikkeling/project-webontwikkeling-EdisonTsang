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
        console.log('Welkom bij de JSON-gegevensviewer!');
        console.log('1. Bekijk alle gegevens');
        console.log('2. Filter op ID');
        console.log('3. Exit');3
        
        let choice:number = readline.questionInt("Vul uw keuze in: ");
        
        if(choice === 1){
            games.forEach((game) => {
                console.log(`- ${game.name}  (${game.id})`);
                console.log('.................................');
                console.log();
              });
        } else if (choice === 2){
            let inputId: string = readline.question("Voer de ID in waarop u wilt filteren: ")
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
                console.log(`- Developer: 3${chosenGame.developers.name}:`);
                console.log(`  - IsActive: ${chosenGame.developers.isActive}`);
                console.log(`  - GamesPublished: ${chosenGame.developers.gamesPublished}`);
                console.log("");
              } else {
                console.log(`Geen spel is gevonden met deze ID`);
                console.log("");
              }
        }
        else{
        again = false;
        }
    }
}

ConsoleApp();




