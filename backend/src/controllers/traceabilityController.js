const Lot = require('../models/Lot');
const { generateQRCode, generateLotNumber } = require('../utils/helpers');

const createLot = async (req, res) => {
  try {
    const { productType, quantity, unit } = req.body;
    const lotNumber = generateLotNumber();
    const qrCode = await generateQRCode(lotNumber);

    const lot = await Lot.create({
      lotNumber,
      qrCode,
      productType,
      quantity,
      unit,
      status: 'received',
    });

    res.status(201).json(lot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLots = async (req, res) => {
  try {
    const lots = await Lot.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(lots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLotById = async (req, res) => {
  try {
    const lot = await Lot.findByPk(req.params.id);
    if (!lot) {
      return res.status(404).json({ error: 'Lot not found' });
    }
    res.json(lot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLotStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const lot = await Lot.findByPk(req.params.id);
    if (!lot) {
      return res.status(404).json({ error: 'Lot not found' });
    }
    await lot.update({ status });
    res.json(lot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createLot,
  getLots,
  getLotById,
  updateLotStatus,
};
