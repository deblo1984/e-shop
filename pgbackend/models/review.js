module.exports = (sequelize, Sequelize) => {
    const Review = sequelize.define('review', {
        rating: {
            type: Sequelize.INTEGER
        },
        comment: {
            type: Sequelize.STRING
        }
    }, {
        underscored: true
    })
    return Review
}