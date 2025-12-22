const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Packaging = sequelize.define('Packaging', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  lotId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  packagingDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  qrCodeFinal: {
    type: DataTypes.STRING,
    unique: true,
  },
  packagingType: {
    type: DataTypes.ENUM('vacuum', 'modified_atmosphere', 'frozen'),
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
  productionDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  bestBeforeDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  label: {
    type: DataTypes.STRING,
  },
  temperature: {
    type: DataTypes.DECIMAL(5, 2),
  },
  status: {
    type: DataTypes.ENUM('pending', 'packaged', 'labeled', 'ready_for_storage'),
    defaultValue: 'pending',
  },
  operatorId: {
    type: DataTypes.UUID,
  },
}, {
  timestamps: true,
});

module.exports = Packaging;
