const QualityControl = require('../models/QualityControl');
const Lot = require('../models/Lot');

// Create quality control record
const createQualityControl = async (req, res) => {
  try {
    const {
      lotId,
      checkType,
      visualInspection,
      odorTest,
      temperatureCheck,
      pHMeasurement,
      microbiologicalTest,
      foreignObjectsCheck,
      packagingIntegrity,
      labelingCorrect,
      notes,
    } = req.body;

    // Verify lot exists
    const lot = await Lot.findByPk(lotId);
    if (!lot) {
      return res.status(404).json({ error: 'Lot not found' });
    }

    const control = await QualityControl.create({
      lotId,
      checkType,
      visualInspection,
      odorTest,
      temperatureCheck,
      pHMeasurement,
      microbiologicalTest,
      foreignObjectsCheck,
      packagingIntegrity,
      labelingCorrect,
      notes,
      checkedBy: req.user.id,
      checkedAt: new Date(),
      status: 'completed',
    });

    console.log('✓ Quality control created:', control.id);
    res.json({ control });
  } catch (error) {
    console.error('Error creating quality control:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all quality controls
const getQualityControls = async (req, res) => {
  try {
    const controls = await QualityControl.findAll({
      order: [['createdAt', 'DESC']],
    });
    console.log(`✓ Fetched ${controls.length} quality controls`);
    res.json(controls);
  } catch (error) {
    console.error('Error fetching quality controls:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get quality control by ID
const getQualityControlById = async (req, res) => {
  try {
    const { id } = req.params;
    const control = await QualityControl.findByPk(id);

    if (!control) {
      return res.status(404).json({ error: 'Quality control not found' });
    }

    res.json(control);
  } catch (error) {
    console.error('Error fetching quality control:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get quality controls by lot
const getQualityControlsByLot = async (req, res) => {
  try {
    const { lotId } = req.params;
    const controls = await QualityControl.findAll({
      where: { lotId },
      order: [['createdAt', 'DESC']],
    });
    res.json(controls);
  } catch (error) {
    console.error('Error fetching quality controls:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createQualityControl,
  getQualityControls,
  getQualityControlById,
  getQualityControlsByLot,
};
