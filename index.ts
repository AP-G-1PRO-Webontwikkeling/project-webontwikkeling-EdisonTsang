import { Developer, Game } from './interfaces';
import express, { Request, Response } from 'express';
import { connect, getDevelopers, getGames, updateGameTitle, updateGamePlatforms, updateGameDate,updateGameGenre,DeleteCollection} from "./database";


const app = express();
app.set("port", process.env.PORT || 3000);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended:true}))
app.set('view engine', 'ejs');

app.use(express.static('public'));

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

app.get('/detail/:id', async (req: Request, res: Response) => {
  const games: Game[] = await getGames(); 
  const gameId: string = req.params.id;
  const chosenGame = findGameById(gameId, games);
  if (chosenGame) {
    res.render('detail', { game: chosenGame });
  } else {
    res.status(404).send('Game not found');
  }
});

app.get('/developer', async(req: Request, res: Response) => {
  let developer: Developer [] = await getDevelopers();
 res.render("developer", {developer :developer });
});

app.get('/developerDetail/:id', async (req: Request, res: Response) => {
  const developer: Developer[] = await getDevelopers();
  const developerId: string = req.params.id;
  const chosenDeveloper = findDeveloperById(developerId, developer);
  if (chosenDeveloper) {
    res.render('developerDetail', { developer: chosenDeveloper });
  } else {
    res.status(404).send('Developer not found');
  }
});



function findGameById(id: string, games: Game[]): Game | undefined {
  return games.find((game) => game.id === id);
}

function findDeveloperById(id: string, developers: Developer[]): Developer | undefined {
  return developers.find((developer) => developer.id === id);
}


app.get('/edit/:id', async (req: Request, res: Response) => {
  const games: Game[] = await getGames(); 
  const gameId: string = req.params.id;
  const chosenGame = await findGameById(gameId,games);
  if (chosenGame) {
    res.render('edit', { game: chosenGame });
  } else {
    res.status(404).send('Game not found');
  }
});

// Route voor het opslaan van de bewerkte gegevens
app.post('/edit/:id', async (req: Request, res: Response) => {
  const gameId: string = req.params.id;
  let title: string = req.body.name;
  let platforms: string[] = req.body.platforms;
  let releaseDate: string = req.body.releaseDate;
  let genre: string = req.body.genre;
  await updateGameTitle(gameId, title);
  await updateGamePlatforms(gameId, platforms);
  await updateGameDate(gameId,releaseDate)
  await updateGameGenre(gameId,genre)
  res.redirect('/');
});


app.listen(app.get("port"), async() => {
 // await DeleteCollection();
  await connect();
  console.log("Server started on http://localhost:" + app.get('port'));
 
});

