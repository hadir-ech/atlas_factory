const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Shipping = sequelize.define('Shipping', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  shippingNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  lotId: {
    type: DataTypes.UUID,
  },
  shippingDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  expectedDeliveryDate: {
    type: DataTypes.DATE,
  },
  actualDeliveryDate: {
    type: DataTypes.DATE,
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
    defaultValue: 'kg',
  },
  temperatureAtShipping: {
    type: DataTypes.DECIMAL(5, 2),
  },
  status: {
    type: DataTypes.ENUM('prepared', 'in_transit', 'delivered', 'returned', 'cancelled'),
    defaultValue: 'prepared',
  },
  carrier: {
    type: DataTypes.STRING,
  },
  trackingNumber: {
    type: DataTypes.STRING,
  },
  notes: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: true,
});

module.exports = Shipping;
