const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Lot = sequelize.define('Lot', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  qrCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  lotNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
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
  status: {
    type: DataTypes.ENUM(
      'received',
      'cutting',
      'grinding',
      'seasoning',
      'packaging',
      'storage',
      'shipped',
      'quality_blocked'
    ),
    defaultValue: 'received',
  },
  temperature: {
    type: DataTypes.DECIMAL(5, 2),
  },
  humidity: {
    type: DataTypes.DECIMAL(5, 2),
  },
  location: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  completedAt: {
    type: DataTypes.DATE,
  },
  notes: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: true,
});

// Associations
Lot.associate = (models) => {
  Lot.hasMany(models.QualityControl, { foreignKey: 'lotId' });
};

module.exports = Lot;
