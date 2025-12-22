const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Analytics = sequelize.define('Analytics', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  metric: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
  },
  category: {
    type: DataTypes.ENUM(
      'temperature',
      'production',
      'quality',
      'maintenance',
      'traceability',
      'commercial'
    ),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
});

module.exports = Analytics;
