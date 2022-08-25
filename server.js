'use strict';

console.log('YOUR first SERVER! Awesome!');

const express = require('express');
require('dotenv').config();
const cors = require('cors');
// const axios = require ('axios');
const getWeather = require ('./modules/Weather.js');
const getMovies = require ('./modules/Movies.js');

// const data = require('./data/weather.json');

const app = express();
const PORT = process.env.PORT || 3002;
// allows one to communicate to external services i.e., APIs
app.use(cors());


// Route Section:
//  Base route:
app.get('/', (request, response) => {
  response.status(200).send('Welcome to our server');
});

// ______________________________________
// weather route
app.get('/weather', getWeather);

// ______________________________________
// movies route
app.get('/movies', getMovies);

// ______________________________________


// Error message section
app.get('*', (request, response) => {
  response.status(500).send('"error": "Something went wrong"');
});

// // catch all NEEDS TO BE AT THE BOTTOM
// app.get('*', (request, response) => {
//   response.status(404).send('This route does not exist');
// });

app.use((error, request, response) => {
  response.status(500).send(error.message);
});

app.listen(PORT,() => console.log(`We are up on PORT: ${PORT}`));


