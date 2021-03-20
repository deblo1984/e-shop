const app = require('./app')
//const db = require('./models');
//const Role = db.role;

//db.sequelize.sync()
/*function initial() {
    Role.create({
        id: 1,
        name: 'user'
    });

    Role.create({
        id: 2,
        name: 'moderator'
    });
    Role.create({
        id: 3,
        name: 'admin'
    })
}*/

if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })


app.listen(process.env.PORT, () => {
    console.log(`Server started on Port :${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})


