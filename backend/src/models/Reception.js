const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Reception = sequelize.define('Reception', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  receptionDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  supplier: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
    defaultValue: 'kg',
  },
  slaughterDate: {
    type: DataTypes.DATE,
  },
  transportTemperature: {
    type: DataTypes.DECIMAL(5, 2),
  },
  sanitaryCertificate: {
    type: DataTypes.STRING,
  },
  // Quality control data
  visualControl: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  smellControl: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  temperatureControl: {
    type: DataTypes.DECIMAL(5, 2),
  },
  coldChainVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM('received', 'accepted', 'rejected', 'blocked'),
    defaultValue: 'received',
  },
  notes: {
    type: DataTypes.TEXT,
  },
  checkedBy: {
    type: DataTypes.UUID,
  },
  checkedAt: {
    type: DataTypes.DATE,
  },
}, {
  timestamps: true,
});

module.exports = Reception;
