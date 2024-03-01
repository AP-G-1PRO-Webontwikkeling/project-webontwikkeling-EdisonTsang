import gamesData from './games.json';
import developerData from './developers.json';
import { Game } from './interfaces';
import * as readline from 'readline-sync';

const games: Game[] = gamesData;

let again:boolean = true;

while(again){
    console.log('Welcome to the JSON data viewer!');
    console.log('1. View all data');
    console.log('2. Filter by ID');
    console.log('3. Exit');
    
    let choice:number = readline.questionInt("");
    
    if(choice === 1){
        games.forEach((game) => {
            console.log(`Game: ${game.name}  (${game.id})`);
            console.log('\n-----------------\n');
          });
    } else if (choice === 2){
        let idFilterChoice:string = readline.question("Please enter the ID you want to filter by: ");
        const filteredGame = games.find((game) => game.id === idFilterChoice);
    }
    else{
    again = false;
    }
}




