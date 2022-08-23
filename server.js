'use strict';

console.log('YOUR first SERVER! Awesome!');

const {response} = require('express');
const express = require('express');

const app = express();

require('dotenv').config();

const PORT = process.env.PORT || 3002;

app.listen(PORT,() => console.log(`We are up on PORT: ${PORT}`));

// Route Section:
//  Base route:

app.get('/', (request, response) => {
  response.status(200).send('Welcome to our server');
});


// catch all NEEDS TO BE AT THE BOTTO<
app.get('*', (request, response) => {
  response.status(404).send('This route does not exist');
});


  

