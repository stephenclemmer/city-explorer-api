'use strict';

const express = require('express');
const app = express();
const axios = require ('axios');

// app.get('/movies', getMovies);

async function getMovies(request, response, next) {
  
  let city = request.query.city;
  console.log(city);
  console.log(process.env.REACT_APP_MOVIE_API_KEY)
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


module.exports = getMovies;