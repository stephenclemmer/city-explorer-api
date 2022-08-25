'use strict';

const express = require('express');
const app = express();
const axios = require ('axios');

// app.get('/weather', getWeather);

async function getWeather(request, response, next) {
  console.log('serverside weather');
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


module.exports = getWeather;