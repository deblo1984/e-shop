const dbConfig = require('../config/db.config')

const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.Host,
    dialect: dbConfig.dialect,
    operatorAliases: false,
    logging: false,
    pool: {
        max: dbConfig.poolmax,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./user')(sequelize, Sequelize);
db.role = require('./role')(sequelize, Sequelize);
db.tutorial = require('./tutorial')(sequelize, Sequelize);
db.product = require('../models/product')(sequelize, Sequelize);
db.photo = require('../models/photo')(sequelize, Sequelize)
db.category = require('../models/category')(sequelize, Sequelize);
db.review = require('../models/review')(sequelize, Sequelize);

//define user has many products
db.user.hasMany(db.product, {
    foreignKey: 'user_id'
})

//define product has many photo
db.product.hasMany(db.photo);
db.photo.belongsTo(db.product, { onDelete: 'CASCADE' })

db.category.hasOne(db.product);
db.product.belongsTo(db.category);

db.product.hasMany(db.review);
db.review.belongsTo(db.user);


db.role.belongsToMany(db.user, {
    through: 'user_roles',
    foreignKey: 'role_id',
    otherKey: 'user_id'
});

db.user.belongsToMany(db.role, {
    through: 'user_roles',
    foreignKey: 'user_id',
    otherKey: 'role_id',
    logging: false,
});

db.ROLES = ['user', 'admin', 'moderator']

module.exports = db;