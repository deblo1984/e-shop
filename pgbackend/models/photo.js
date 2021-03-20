module.exports = (sequelize, Sequelize) => {
    const Photo = sequelize.define('photo', {
        public_id: {
            type: Sequelize.STRING
        },
        url: {
            type: Sequelize.STRING
        },
        isMain: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }, { underscored: true })
    return Photo;
}