import gamesData from './games.json';
import developerData from './developers.json';
import { Developer, Game } from './interfaces';
import * as readline from 'readline-sync';
import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static('public'));
const games: Game[] = gamesData;
const developers: Developer[]   = developerData;

app.get('/', (req: Request, res: Response) => {

  let { sort = 'name', order = 'asc', search = '' } = req.query as { sort?: string; order?: string; search?: string };

  let filteredGames = games.filter(game => 
    game.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedGames = games.sort((a, b) => {
    let fieldA = a[sort as keyof Game];
    let fieldB = b[sort as keyof Game];

    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      fieldA = fieldA.toLowerCase();
      fieldB = fieldB.toLowerCase();
    }
    if (order === 'asc') {
      return fieldA > fieldB ? 1 : -1;
    } else {
      return fieldA < fieldB ? 1 : -1;
    }
  });
  res.render('index', { games: sortedGames, search, sort, order });
});

app.get('/developers.ejs', (req: Request, res: Response) => {

  let { sort = 'name', order = 'asc', search = '' } = req.query as { sort?: string; order?: string; search?: string };

  let filteredDevelopers = developers.filter(developer => 
    developer.name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedDevelopers = developers.sort((a, b) => {
    let fieldA = a[sort as keyof Developer];
    let fieldB = b[sort as keyof Developer];

    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      fieldA = fieldA.toLowerCase();
      fieldB = fieldB.toLowerCase();
    }
    if (order === 'asc') {
      return fieldA > fieldB ? 1 : -1;
    } else {
      return fieldA < fieldB ? 1 : -1;
    }
  });
  res.render('index', { developers: sortedDevelopers, search, sort, order });
});

app.post('/search', (req: Request, res: Response) => {
  const { search } = req.body;
  // Redirect naar de GET-route met de zoekterm als query parameter
  res.redirect(`/?search=${encodeURIComponent(search)}`);
});

app.get('/detail/:id', (req: Request, res: Response) => {
  const gameId: string = req.params.id;
  const chosenGame = findGameById(gameId);
  if (chosenGame) {
    res.render('detail', { game: chosenGame });
  } else {
    res.status(404).send('Game not found');
  }
});

function findGameById(id: string): Game | undefined {
  return games.find((game) => game.id === id);
}

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


//DEEL 1

/*
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
*/



