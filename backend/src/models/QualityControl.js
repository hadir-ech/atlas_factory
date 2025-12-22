const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const QualityControl = sequelize.define('QualityControl', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  lotId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  checkType: {
    type: DataTypes.ENUM(
      'initial',
      'intermediate',
      'final',
      'hand_washing',
      'knife_disinfection',
      'surface_cleaning',
      'material_reception',
      'temperature_check',
      'visual_inspection'
    ),
    allowNull: false,
  },
  // HACCP Test Scores (0-10)
  visualInspection: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  odorTest: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  temperatureCheck: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  pHMeasurement: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  microbiologicalTest: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  // Physical Checks
  foreignObjectsCheck: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  packagingIntegrity: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  labelingCorrect: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  // Legacy fields
  status: {
    type: DataTypes.ENUM('passed', 'failed', 'pending', 'completed'),
    defaultValue: 'pending',
  },
  temperature: {
    type: DataTypes.DECIMAL(5, 2),
  },
  notes: {
    type: DataTypes.TEXT,
  },
  photoUrl: {
    type: DataTypes.STRING,
  },
  checkedBy: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  checkedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
});

// Associations
QualityControl.associate = (models) => {
  QualityControl.belongsTo(models.Lot, { foreignKey: 'lotId' });
  QualityControl.belongsTo(models.User, { foreignKey: 'checkedBy', as: 'checker' });
};

module.exports = QualityControl;
