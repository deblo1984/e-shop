module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true
        },
        name: { type: Sequelize.STRING, allowNull: false },
        email: { type: Sequelize.STRING, allowNull: false, unique: true },
        password: { type: Sequelize.STRING, allowNull: false },
        avatar: { type: Sequelize.STRING },
        resetPasswordToken: { type: Sequelize.STRING },
        resetPasswordExpires: { type: Sequelize.DATE }
    }, { underscored: true })
    return User
};
