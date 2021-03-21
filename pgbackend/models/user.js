module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
        name: { type: Sequelize.STRING, allowNull: false },
        email: { type: Sequelize.STRING, allowNull: false, unique: true },
        password: { type: Sequelize.STRING, allowNull: false },
        avatar: { type: Sequelize.STRING },
        role: { type: Sequelize.STRING, defaultValue: 'user' },
    }, { underscored: true })
    return User
};
