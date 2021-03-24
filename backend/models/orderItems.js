module.exports = (sequelize, Sequelize) => {
    const OrderItems = sequelize.define('orderItems', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV1
        },
        quantity: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        price: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        total: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        productId: {
            type: Sequelize.UUID,
            allowNull: false
        },
        orderId: {
            type: Sequelize.UUID,
            allowNull: false
        }
    }, {
        underscored: true
    })
    return OrderItems;
}