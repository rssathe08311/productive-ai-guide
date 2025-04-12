// app.js

const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');

const dotenv = require('dotenv');
dotenv.config();

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});



// 4) Import the router
const router = require('./router.js');

// 5) Set up Express
const port = process.env.PORT || process.env.NODE_PORT || 3000;
const app = express();

app.use('/assets', express.static(path.resolve(`${__dirname}/../client/`)));
app.use(express.static(path.join(__dirname, '..', 'client')));


app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 6) Set up Handlebars
app.engine('handlebars', expressHandlebars.engine({
  defaultLayout: '',
}));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);

// 7) Pass app + openai client to router
router(app, openai);

// 8) Listen
app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Listening on port ${port}`);
});
