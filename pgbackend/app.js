const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

// Setting up config file 
if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })
// dotenv.config({ path: 'backend/config/config.env' })

app.use(express.json());
app.use(cookieParser());


//import all routes

const tutorial = require('./routes/tutorial.routes');

app.use('/api/', tutorial)



module.exports = app