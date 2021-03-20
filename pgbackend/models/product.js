module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define('product', {
        name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
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