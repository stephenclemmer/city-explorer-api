'use strict';

console.log('YOUR first SERVER! Awesome!');

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const data = require('./data/weather.json');

const PORT = process.env.PORT || 3002;

const app = express();
// allows one to communicate to external services i.e., APIs
app.use(cors());

// Route Section:
//  Base route:
app.get('/', (request, response) => {
  response.status(200).send('Welcome to our server');
});

// weather route
app.get('/weather', (request, response, next) => {
  try {
    let cityName = request.query.city;
    let dataToGroom = data.find(city => city.city_name === cityName);
    let dataToSend = dataToGroom.data.map(object => {
      return new Forecast(object);
    });

    response.status(200).send(dataToSend);

  }catch(error){
    next(error);
  }

});

class Forecast {
  constructor(weatherObj){
    this.date = weatherObj.valid_date;
    this.description = weatherObj.weather.description;
  }
}

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


