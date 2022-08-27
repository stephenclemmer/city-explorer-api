'use strict';

const axios = require('axios');

let cache = require('./cache.js');

// __________________________
async function getMovies(request, response, next) {

  let city = request.query.city;
  // console.log(city);
  // console.log(process.env.REACT_APP_MOVIE_API_KEY)

  const key = 'movies-' + city;

  const movieURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&query=${city}`;

  if (cache[key] && (Date.now() - cache[key].timestamp < 120000)) {
    console.log('Movie Cache hit');
  } else {
    console.log('Movie Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    let result = await axios.get(movieURL);
    cache[key].data = result.data;
    console.log(movieURL);



    try {
      let cityData = cache[key].data;

      let dataToSend = cityData.results.map(object => new Playing(object));
      response.status(200).send(dataToSend);
    }

    catch (error) {
      next(error);
    }
  }
}

class Playing {
  constructor(movieObj) {
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