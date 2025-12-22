const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const IoTSensor = sequelize.define('IoTSensor', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  sensorId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  sensorName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM(
      'temperature',
      'humidity',
      'pressure',
      'vibration',
      'sound'
    ),
    allowNull: false,
  },
  currentValue: {
    type: DataTypes.DECIMAL(10, 2),
  },
  unit: {
    type: DataTypes.STRING,
  },
  minThreshold: {
    type: DataTypes.DECIMAL(10, 2),
  },
  maxThreshold: {
    type: DataTypes.DECIMAL(10, 2),
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'error'),
    defaultValue: 'active',
  },
  lastReadAt: {
    type: DataTypes.DATE,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

module.exports = IoTSensor;
