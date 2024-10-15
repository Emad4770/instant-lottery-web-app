// imports
import express from 'express';
import dayjs from 'dayjs';
import Dao from './dao/dao-v2.mjs';
import morgan from 'morgan';
import cors from 'cors';
import { check, validationResult } from 'express-validator';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import UserDao from './dao/user-dao.mjs';
import initGame from './logics/gameLogic.mjs';
import createCountdown from './logics/countdown.mjs';

// init express
const app = new express();
const port = 3001;
// init dao
const dao = new Dao();
const userDao = new UserDao();



// Middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(session({
  secret: 'thisssssss is my secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.authenticate('session'));
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
};
app.use(cors(corsOptions));

// Passport middleware
passport.use(new LocalStrategy(function verify(username, password, callback) {
  userDao.getUserByCredentials(username, password)
    .then(user => {
      if (!user) {
        return callback(null, false, { error: 'Incorrect username or password.' });
      }
      return callback(null, user);
    }
    )
}));

passport.serializeUser(function (user, callback) {
  callback(null, user);
});

passport.deserializeUser(function (user, callback) {
  return callback(null, user);
});

/******** Initalizing the game *********/


const timer = 120 // 120 seconds = 2 minutes
// remember to also change the timer in the initGame function

// Initialize the game for the first time at the start of the server
let time = dayjs().format('YYYY-MM-DD HH:mm:ss');
let countdown = new createCountdown(timer); // countdown receives the time in seconds
console.log(`Initializing game at ${time}`);
await initGame(time, countdown);

// Set an interval to start a new round every 2 minutes and 5 seconds
setInterval(async () => {
  try {
    time = dayjs().format('YYYY-MM-DD HH:mm:ss');
    countdown = new createCountdown(timer); // countdown receives the time in seconds
    console.log(`Initializing game at ${time}`);
    await initGame(time, countdown);
  }
  catch (err) {
    console.error(err);
  }
}, (timer * 1000) + 5000); // 2 minutes + 5 seconds



// This function is used to handle validation errors
const onValidationErrors = (validationResult, res) => {
  const errors = validationResult.formatWith(errorFormatter);
  return res.status(422).json({ validationErrors: errors.mapped() });
};

// Only keep the error message in the response
const errorFormatter = ({ msg }) => {
  return msg;
};
// validate the request body for the bet numbers
const numberValidation = [
  check('numbers').isArray({ min: 1, max: 3 }).withMessage('You must provide between 1 to 3 distinct numbers'),
  check('numbers.*').isInt({ min: 1, max: 90 }).withMessage('Numbers must be in the range of 1-90'),
  check('numbers').custom((value, { req }) => {  // Custom validator to check if the numbers are distinct
    const distinctNumbers = [...new Set(value)]; // set object removes duplicates
    if (distinctNumbers.length !== value.length) { // check if the length of the array is the same
      throw new Error('The numbers must be distinct');
    }
    return true;
  })
];

// validation for user bet numbers and sanity checks
const validateBetMiddleware = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userNumbers = req.body.numbers;
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const lastDraw = await dao.getLastDraw(); // Get the last draw ID and timestamp
    const spentPoints = userNumbers.length * 5; // Calculate the points spent by the user


    // we check both the remaining time and the timestamp of the last draw to make sure the user can bet on it
    if (countdown.getRemainingTime() < 0) { // Checks if the time to bet on this draw has expired
      return res.status(400).json({ error: 'The time to bet on this draw has expired' });
    }
    if (dayjs(lastDraw.timestamp).add(2, 'minute').isBefore(currentTime)) { // Checks if the time to bet on this draw has expired
      return res.status(400).json({ error: 'The time to bet on this draw has expired' });
    }

    if (lastDraw.numbers) { // Checks if the draw has already been drawn, if so, you cannot bet on it
      return res.status(400).json({ error: 'The draw has already been drawn' });
    }


    await dao.checkAlreadyBet(userId, lastDraw.id); // Checks if the user has already bet on this draw before, resolves true if ok
    const { points } = await userDao.getUserById(userId); // Get the current total points of the user
    if (points < spentPoints || points == 0) { // Check if the user has enough points to bet
      return res.status(400).json({ error: 'You do not have enough points to bet.' });
    }
    /**  end of sanity checks */

    // set the request object to be used in the api - using res.locals for more security
    res.locals.lastDraw = lastDraw;
    res.locals.userPoints = points;
    res.locals.spentPoints = spentPoints;

    next();
  } catch (error) {
    res.status(503).json(error);
  }
};

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
};



/***** APIs ***********/
// API endpoint for login
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json(info);
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.json(req.user);
    });
  }
  )(req, res, next);
});

// GET /api/sessions/current
// This route checks whether the user is logged in or not.
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    // console.log('req.user: ', req.user);

    res.status(200).json({ id: req.user.id, username: req.user.username, name: req.user.name });
  }
  else
    res.status(401).json({ error: 'Not authenticated' });
});

// DELETE /api/session/current
// This route is used for loggin out the current user.
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});


// POST /api/bets
// This route is used to add a new bet to the database after validating the request body.
app.post('/api/bets', isLoggedIn, numberValidation, validateBetMiddleware, async (req, res) => {

  const userId = req.user.id;
  const userNumbers = req.body.numbers;
  const currentTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
  // comming from the middleware
  const lastDraw = res.locals.lastDraw;
  const points = res.locals.userPoints;
  const spentPoints = res.locals.spentPoints;

  const invalidFields = validationResult(req);
  if (!invalidFields.isEmpty()) {
    return onValidationErrors(invalidFields, res);
  }

  try {
    // Create a new bet for the user and get the bet ID
    const betId = await dao.createBet(userId, lastDraw.id, userNumbers, currentTime, spentPoints);
    const newTotalPoints = points - spentPoints; // Calculate the new total points of the user
    await dao.updateTotalPoints(userId, newTotalPoints); // Update the total points of the user
    res.status(201).json({ betId: betId, numbers: userNumbers });

  } catch (error) {
    res.status(503).json(error);
  }
});

// GET /api/bestplayers
// This route is used to get the top 3 players with the highest points.
app.get('/api/top-players', isLoggedIn, async (req, res) => {
  try {
    const bestPlayers = await dao.getTopPlayers();
    res.json(bestPlayers);
  } catch (error) {
    res.status(500).json(error);
  }
});


// GET /api/results
/**This route is used to get the results of the last draw. */

app.get('/api/result', isLoggedIn, async (req, res) => {

  try {

    const userId = req.user.id;
    const lastDraw = await dao.getLastDraw();
    const userBet = await dao.getUserBet(userId, lastDraw.id);
    const { points } = await userDao.getUserById(userId);

    if (userBet.error) { // this means the user has not bet on this draw
      return res.status(200).json(userBet);
    }
    else { // adding the total points to the response
      res.status(200).json({ drawId: userBet.draw_id, userNumbers: userBet.numbers, pointsSpent: userBet.points_spent, pointsWon: userBet.points_won, result: userBet.result, drawnNumbers: userBet.drawn_numbers, totalPoints: points });
    }

  } catch (error) {
    res.status(500).json(error);
  }
});

// GET /api/last-draw
// This route is used to get the last draw numbers if they have been drawn.
app.get('/api/last-draw', isLoggedIn, async (req, res) => {

  try {
    const lastDraw = await dao.getLastDraw();

    res.status(200).json({ drawId: lastDraw.id, numbers: lastDraw.numbers, timestamp: lastDraw.timestamp });
  }
  catch (error) {
    res.status(500).json(error);
  }
}
);

// GET /api/history
// This route is used to get the betting history of the current user.
app.get('/api/history', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;
    const bets = await dao.getAllUserBets(userId);
    res.status(200).json(bets);
  } catch (error) {
    res.status(500).json(error);
  }
});

// API endpoint to get the remaining time for the current draw
app.get('/api/remaining-time', isLoggedIn, (req, res) => {
  const remainingTime = countdown.getRemainingTime();
  if (remainingTime === undefined) {
    return res.status(503).json({ error: 'The countdown has not been initialized yet' });
  } else {
    res.json({ "remainingTime": remainingTime });
  }
}
);

// API endpoint to get the user info
app.get('/api/userinfo', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userDao.getUserById(userId);
    res.json(user);
  }
  catch (error) {
    res.status(500).json(error);
  }
}
);


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});