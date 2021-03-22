module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define('product', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        rating: {
            type: Sequelize.DOUBLE,
            defaultValue: 0
        },
        price: {
            type: Sequelize.DOUBLE,
            defaultValue: 0
        },
        stock: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        numOfReviews: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
    }, {
        underscored: true
    })
    return Product
}