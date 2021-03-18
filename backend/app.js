const express = require('express');
const app = express();

const errorMiddleware = require('./middlewares/errorMiddleware')

app.use(express.json());


//import all routes

const products = require('./routes/product');

app.use('/api/v1/', products)

app.use(errorMiddleware)


module.exports = app