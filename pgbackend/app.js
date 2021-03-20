const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');

// Setting up config file 
if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })
// dotenv.config({ path: 'backend/config/config.env' })

app.use(express.json());
app.use(cookieParser());
app.use(bodyparser());


//import all routes

const tutorial = require('./routes/tutorial.routes');
const category = require('./routes/category.routes');
const product = require('./routes/product.routes');

app.use('/api/', tutorial);
app.use('/api/', category);
app.use('/api/', product);



module.exports = app