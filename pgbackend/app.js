const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/error')
const db = require('./models')

// Setting up config file 
if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })
// dotenv.config({ path: 'backend/config/config.env' })

db.sequelize.sync()

app.use(express.json());
app.use(cookieParser());


//import all routes

const tutorial = require('./routes/tutorial.routes');
const category = require('./routes/category.routes');
const product = require('./routes/product.routes');
const user = require('./routes/user.routes');

app.use('/api/', tutorial);
app.use('/api/', category);
app.use('/api/', product);
app.use('/api', user);

app.use(notFound);
app.use(errorHandler);



module.exports = app