const Cutting = require('../models/Cutting');
const Lot = require('../models/Lot');
const QualityControl = require('../models/QualityControl');

// Create cutting record with hygiene checks
const createCutting = async (req, res) => {
  try {
    const {
      lotId,
      inputQuantity,
      handWashing,
      knifeDisinfection,
      equipmentWorn,
      surfaceCleaned,
    } = req.body;

    // Check if lot exists
    const lot = await Lot.findByPk(lotId);
    if (!lot) {
      return res.status(404).json({ error: 'Lot not found' });
    }

    // All hygiene checks must pass
    const allHygieneChecksPassed = handWashing && knifeDisinfection && equipmentWorn && surfaceCleaned;

    if (!allHygieneChecksPassed) {
      return res.status(400).json({ error: 'All hygiene checks must pass before cutting' });
    }

    // Create cutting record
    const cutting = await Cutting.create({
      lotId,
      inputQuantity,
      handWashing,
      knifeDisinfection,
      equipmentWorn,
      surfaceCleaned,
      status: 'in_progress',
      operatorId: req.user.id,
    });

    // Create quality control record for hygiene
    await QualityControl.create({
      lotId,
      checkType: 'hand_washing',
      status: handWashing ? 'passed' : 'failed',
      checkedBy: req.user.id,
      checkedAt: new Date(),
    });

    await QualityControl.create({
      lotId,
      checkType: 'knife_disinfection',
      status: knifeDisinfection ? 'passed' : 'failed',
      checkedBy: req.user.id,
      checkedAt: new Date(),
    });

    // Update lot status
    await lot.update({ status: 'cutting' });

    res.status(201).json({
      cutting,
      message: 'Cutting started with hygiene checks passed',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Complete cutting and record output quantity
const completeCutting = async (req, res) => {
  try {
    const { cuttingId, outputQuantity } = req.body;

    const cutting = await Cutting.findByPk(cuttingId);
    if (!cutting) {
      return res.status(404).json({ error: 'Cutting record not found' });
    }

    const wastage = cutting.inputQuantity - outputQuantity;

    await cutting.update({
      outputQuantity,
      wastage,
      status: 'completed',
    });

    const lot = await Lot.findByPk(cutting.lotId);
    await lot.update({ status: 'grinding' });

    res.json({
      cutting,
      summary: {
        input: cutting.inputQuantity,
        output: outputQuantity,
        wastage,
        wastePercentage: ((wastage / cutting.inputQuantity) * 100).toFixed(2),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all cuttings
const getCuttings = async (req, res) => {
  try {
    const cuttings = await Cutting.findAll({
      order: [['cuttingDate', 'DESC']],
    });
    res.json(cuttings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get cuttings by lot
const getCuttingsByLot = async (req, res) => {
  try {
    const { lotId } = req.params;
    const cuttings = await Cutting.findAll({
      where: { lotId },
      order: [['cuttingDate', 'DESC']],
    });
    res.json(cuttings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCutting,
  completeCutting,
  getCuttings,
  getCuttingsByLot,
};
