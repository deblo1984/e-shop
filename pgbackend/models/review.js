module.exports = (sequelize, Sequelize) => {
    const Review = sequelize.define('review', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true
        },
        rating: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        comment: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        productId: {
            type: Sequelize.UUID
        },
        userId: {
            type: Sequelize.UUID
        }
    }, {
        underscored: true
    })
    return Review
}