const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/errorMiddleware');

// Setting up config file 
if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })
// dotenv.config({ path: 'backend/config/config.env' })

app.use(express.json());
app.use(cookieParser());


//import all routes

const products = require('./routes/productRoutes');
const user = require('./routes/userRoutes')
const order = require('./routes/orderRoutes')

app.use('/api/v1/', products)
app.use('/api/v1/', user)
app.use('/api/v1/', order)

app.use(errorMiddleware)


module.exports = app