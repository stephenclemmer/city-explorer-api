'use strict';

console.log('YOUR first SERVER! Awesome!');

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const axios = require ('axios');

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

// weather route
app.get('/weather', getWeather);

async function getWeather(request, response, next) {
  let latitude = request.query.lat;
  let longitude = request.query.lon;
  const weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&key=${process.env.REACT_APP_WEATHER_API_KEY}`;

  try {
    let cityData = await axios.get(weatherURL);
    let dataToGroom = cityData.data;

    let dataToSend = dataToGroom.data.map(object => {
      return new Forecast(object);

    });
    response.status(200).send(dataToSend);
  }

  catch(error){
    next(error);
  }
}

class Forecast {
  constructor(weatherObj){
    this.date = weatherObj.valid_date;
    this.description = weatherObj.weather.description;
  }
}
// ______________________________________
app.get('/movies', getMovies);

async function getMovies(request, response, next) {
  let city = request.query.city;
  const movieURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&query=${city}`;

  try {
    let cityData = await axios.get(movieURL);
    let dataToSend = cityData.data.results.map(object => new Playing(object));
    response.status(200).send(dataToSend);
  }

  catch(error){
    next(error);
  }
}

class Playing {
  constructor(movieObj){
    this.title = movieObj.title;
    this.poster = movieObj.poster_path;
    this.overview = movieObj.overview;
    this.average_votes = movieObj.vote_average;
    this.total_votes = movieObj.vote_count;
    this.popularity = movieObj.popularity;
    this.release_date = movieObj.release_date;
  }
}

// ______________________________________
// Error message
app.get('*', (request, response) => {
  response.status(500).send('"error": "Something went wrong"');
});

// // catch all NEEDS TO BE AT THE BOTTOM
// app.get('*', (request, response) => {
//   response.status(404).send('This route does not exist');
// });

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.listen(PORT,() => console.log(`We are up on PORT: ${PORT}`));


