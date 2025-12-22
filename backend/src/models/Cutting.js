const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Cutting = sequelize.define('Cutting', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  lotId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  cuttingDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  // Hygiene checklist
  handWashing: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  knifeDisinfection: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  equipmentWorn: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  surfaceCleaned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  // Production data
  inputQuantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  outputQuantity: {
    type: DataTypes.DECIMAL(10, 2),
  },
  wastage: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'blocked'),
    defaultValue: 'pending',
  },
  operatorId: {
    type: DataTypes.UUID,
  },
  supervisorId: {
    type: DataTypes.UUID,
  },
  notes: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: true,
});

module.exports = Cutting;
