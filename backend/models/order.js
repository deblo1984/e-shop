module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define('order', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        address: {
            type: Sequelize.STRING,
            allowNull: false
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: true
        },
        postalCode: {
            type: Sequelize.STRING,
        },
        province: {
            type: Sequelize.STRING,
            allowNull: false
        },
        country: {
            type: Sequelize.STRING,
            allowNull: false
        },
        paymentId: {
            type: Sequelize.STRING
        },
        paymentStatus: {
            type: Sequelize.STRING
        },
        paidStatus: {
            type: Sequelize.BOOLEAN,
            default: false
        },
        paidAt: {
            type: Sequelize.DATE
        },
        itemsPrice: {
            type: Sequelize.DOUBLE
        },
        taxPrice: {
            type: Sequelize.DOUBLE,
            default: 0
        },
        shippingPrice: {
            type: Sequelize.DOUBLE,
            default: 0
        },
        totalPrice: {
            type: Sequelize.DOUBLE,
            default: 0
        },
        orderStatus: {
            type: Sequelize.STRING,
            allowNull: false,
            default: 'Waiting Payment'
        },
        deliveredAt: {
            type: Sequelize.DATE
        },
        userId: {
            type: Sequelize.UUID,
            allowNull: false
        }
    }, {
        underscored: true
    })

    return Order;

}