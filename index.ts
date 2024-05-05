import gamesData from './games.json';
import developerData from './developers.json';
import { Developer, Game } from './interfaces';
import bodyParser from 'body-parser'; // Importeer body-parser
import * as readline from 'readline-sync';
import express, { Request, Response } from 'express';
import { connect, getGames} from "./database";



const app = express();
app.set("port", process.env.PORT || 3000);

app.set('view engine', 'ejs');

app.use(express.static('public'));

let games: Game[] = []; 
const developer : Developer[] = developerData;

app.get('/', async (req: Request, res: Response) => {
  let games: Game[] = await getGames();
  let filteredGames: Game[] = games; 
  const searchQuery: string | undefined = req.query.search as string | undefined;
  if (searchQuery) {
    filteredGames = games.filter(game => game.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }
  let { sort = 'name', order = 'asc' } = req.query as { sort?: string; order?: string };
  filteredGames = sortGames(filteredGames, sort, order);
  res.render('index', { games: filteredGames, searchQuery,sort,order }); 
});

function sortGames(games: Game[], sortBy: string, sortOrder: string): Game[] {
    return games.sort((a, b) => {
        let fieldA = a[sortBy as keyof Game];
        let fieldB = b[sortBy as keyof Game];

        if (typeof fieldA === 'string' && typeof fieldB === 'string') {
            fieldA = fieldA.toLowerCase();
            fieldB = fieldB.toLowerCase();
        }

        if (sortOrder === 'asc') {
            return fieldA > fieldB ? 1 : -1;
        } else {
            return fieldA < fieldB ? 1 : -1;
        }
    });
}

app.get('/developer', async(req: Request, res: Response) => {
 res.render("developer",{developer:developer});
});

app.get('/detail/:id', async (req: Request, res: Response) => {
  const games: Game[] = await getGames(); // Fetch games
  const gameId: string = req.params.id;
  const chosenGame = findGameById(gameId, games); // Pass games array to the function
  if (chosenGame) {
    res.render('detail', { game: chosenGame });
  } else {
    res.status(404).send('Game not found');
  }
});

function findGameById(id: string, games: Game[]): Game | undefined {
  return games.find((game) => game.id === id);
}


app.listen(app.get("port"), async() => {
  await connect();
  console.log("Server started on http://localhost:" + app.get('port'));
 
});

