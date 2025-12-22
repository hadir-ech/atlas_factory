const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Machine = sequelize.define('Machine', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  machineId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  machineName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
  },
  installationDate: {
    type: DataTypes.DATE,
  },
  lastMaintenanceDate: {
    type: DataTypes.DATE,
  },
  nextMaintenanceDate: {
    type: DataTypes.DATE,
  },
  operationalHours: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('operational', 'maintenance', 'broken', 'idle'),
    defaultValue: 'operational',
  },
}, {
  timestamps: true,
});

module.exports = Machine;
