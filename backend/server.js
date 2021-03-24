const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middlewares/error')
const tutorial = require('./routes/tutorial.routes');
const category = require('./routes/category.routes');
const product = require('./routes/product.routes');
const user = require('./routes/user.routes');
const review = require('./routes/review.routes');
const photo = require('./routes/photo.routes');
const order = require('./routes/order.routes');
const db = require('./models')

dotenv.config();

const app = express();

if (process.env.NODE_ENV === 'DEVELOPMENT') {
    app.use(morgan('dev'))
}

const Role = db.role;

db.sequelize.sync()/*.then(() => {
    console.log('Drop and Resync Db');
    initial();
});

function initial() {
    Role.create({
        name: "user"
    });

    Role.create({
        name: "moderator"
    });

    Role.create({
        name: "admin"
    });
}*/

app.use(express.json());
app.use(cookieParser());

app.use('/api/', tutorial);
app.use('/api/', category);
app.use('/api/', product);
app.use('/api/', user);
app.use('/api/', review);
app.use('/api/', photo);
app.use('/api/', order);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`))