'use strict';

const axios = require('axios');
let cache = require('./cache.js');
// __________________________

async function getWeather(request, response, next) {
  let latitude = request.query.lat;
  let longitude = request.query.lon;

  const key = 'weather-' + latitude + longitude;

  const weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&key=${process.env.REACT_APP_WEATHER_API_KEY}`;

  if (cache[key] && (Date.now() - cache[key].timestamp < 20000)) {
    console.log('Weather Cache hit');
  } else {
    console.log('Weather Cache miss');

    cache[key] = {};
    cache[key].timestamp = Date.now();

    let result = await axios.get(weatherURL);

    try {
      cache[key].data = result.data;
      let cityData = cache[key].data;
      let dataToGroom = cityData.data;

      let dataToSend = dataToGroom.map(object => {
        return new Forecast(object);
      });
      response.status(200).send(dataToSend);
    }

    catch (error) {
      next(error);
    }
  }
}

class Forecast {
  constructor(weatherObj) {
    this.date = weatherObj.valid_date;
    this.description = weatherObj.weather.description;
  }
}

module.exports = getWeather;
