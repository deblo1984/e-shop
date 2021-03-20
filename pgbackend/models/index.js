const dbConfig = require('../config/db.config')

const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.Host,
    dialect: dbConfig.dialect,
    operatorAliases: false,

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
db.tutorial = require('./tutorial')(sequelize, Sequelize)

db.role.belongsToMany(db.user, {
    through: 'user_roles',
    foreignKey: 'roleId',
    otherKey: 'userId'
});

db.user.belongsToMany(db.role, {
    through: 'user_roles',
    foreignKey: 'userId',
    otherKey: 'roleId'
});

db.ROLES = ['user', 'admin', 'moderator']

module.exports = db;