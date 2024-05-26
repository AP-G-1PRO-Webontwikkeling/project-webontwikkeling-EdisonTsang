import { Developer, Game , User} from './interfaces';
import express, { Request, Response, Express} from 'express';
import { secureMiddleware } from "./secureMiddleware";
import { connect, getDevelopers, getGames, updateGameTitle, updateGamePlatforms, updateGameDate,updateGameGenre,DeleteCollection, createUser, createAdmin, login, userExists, registerUser } from "./database";
import session from "./session";
import dotenv from "dotenv";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("port", process.env.PORT || 3000);
app.use(session);

app.use(express.static('public'));

app.get('/', secureMiddleware, async (req: Request, res: Response) => {
  let games: Game[] = await getGames();
  let filteredGames: Game[] = games; 
  const searchQuery: string | undefined = req.query.search as string | undefined;
  if (searchQuery) {
    filteredGames = games.filter(game => game.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }
  let { sort = 'name', order = 'asc' } = req.query as { sort?: string; order?: string };
  filteredGames = sortGames(filteredGames, sort, order);
  if (req.session.user) {
    res.render('index', { games: filteredGames, searchQuery,sort,order,user: req.session.user}); 
} else {
    res.redirect("/login");
}
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

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async(req, res) => {
  const email : string = req.body.email;
  const password : string = req.body.password;
  try {
      let user : User = await login(email, password);
      delete user.password; 
      req.session.user = user;
      res.redirect("/")
  } catch (e : any) {
      res.redirect("/login");
  }
});

app.post("/logout", async(req, res) => {
  req.session.destroy(() => {
      res.redirect("/login");
  });
});

app.get('/register', (req: Request, res: Response) => {
  res.render('register', { error: null });
});

app.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (await userExists(email)) {
    return res.render('register', { error: 'email bestaat al!' });
  }

  await registerUser(email, password);
  res.redirect('/login');
});

app.listen(app.get("port"), async() => {
  await DeleteCollection();
  await connect();
  await createUser();
  await createAdmin();
  console.log("Server started on http://localhost:" + app.get('port'));
 
});

