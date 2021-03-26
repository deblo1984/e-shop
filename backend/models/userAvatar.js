module.exports = (sequelize, Sequelize) => {
    const UserAvatar = sequelize.define('userAvatar', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true
        },
        publicId: {
            type: Sequelize.STRING
        },
        url: {
            type: Sequelize.STRING
        },
        userId: {
            type: Sequelize.UUID
        }
    }, { underscored: true })
    return UserAvatar;
}