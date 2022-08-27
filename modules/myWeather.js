'use strict';

const axios = require('axios');

let cache = require('./cache.js');

// __________________________



async function getWeather(request, response, next) {
  let latitude = request.query.lat;
  let longitude = request.query.lon;
  const key = 'weather-' + latitude + longitude;
  const weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&key=${process.env.REACT_APP_WEATHER_API_KEY}`;
  console.log(cache[key]);
  console.log('***********************');
  console.log(cache);
  if (cache[key] && (Date.now() - cache[key].timestamp < 120000)) {
    console.log('Weather Cache hit');
  } else {
    console.log('Weather Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    let result = await axios.get(weatherURL);
    cache[key].data = result.data;
    console.log(weatherURL);

    try {
      let cityData = cache[key].data;
      // console.log(cityData);
      let dataToGroom = cityData.data;
      // console.log(dataToGroom);
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
