const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Production = sequelize.define('Production', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  lotId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  operation: {
    type: DataTypes.ENUM('grinding', 'seasoning', 'mixing', 'other'),
    allowNull: false,
  },
  inputQuantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  outputQuantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  operatorNotes: {
    type: DataTypes.TEXT,
  },
  temperatureMaintained: {
    type: DataTypes.DECIMAL(5, 2),
  },
  duration: {
    type: DataTypes.INTEGER, // in minutes
  },
  operatorId: {
    type: DataTypes.UUID,
  },
  status: {
    type: DataTypes.ENUM('in_progress', 'completed', 'paused'),
    defaultValue: 'completed',
  },
}, {
  timestamps: true,
});

Production.associate = (models) => {
  Production.belongsTo(models.Lot, { foreignKey: 'lotId' });
  Production.belongsTo(models.User, { as: 'operator', foreignKey: 'operatorId' });
};

module.exports = Production;
