
/*

/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT = user

*/
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

// controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authorization');

// create connection between server and database
const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true
  }
});


// init 
const app = express();


// ---- Middleware ---
app.use(cors({origin: true})); // to allow to be accessed from anywhere, so any domain can access
app.use(bodyParser.json()); // to parse data and transform into json
app.use(morgan("combined"))

// -- Configuring CORS

var corsOptions = {
  origin: 'https://facedetection-smartbrain-front.herokuapp.com',
  optionsSuccessStatus: 200
}


// ---- all requests ------

app.get('/', (req, res) => {res.send("It is working")});

app.post('/signin', (req, res) => {signin.signinAuthentication(req, res, db, bcrypt)});

app.post('/register', cors(corsOptions) , (req, res) => {register.handleRegister(req, res, db, bcrypt)});

app.get('/profile/:id', auth.requireAuth, (req, res) => {profile.handleProfileGet(req, res, db)});

app.post('/profile/:id', auth.requireAuth, (req, res) => {profile.handleProfileUpdate(req, res, db)});

app.put('/image', auth.requireAuth, (req, res) => {image.handleImage(req, res, db)});

app.post('/imageurl', auth.requireAuth, (req, res) => {image.handleApiCall(req, res)});


app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});





