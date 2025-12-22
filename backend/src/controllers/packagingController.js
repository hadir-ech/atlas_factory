const Packaging = require('../models/Packaging');
const Lot = require('../models/Lot');
const QRCode = require('qrcode');

// Create packaging record with final QR code and DLC
const createPackaging = async (req, res) => {
  try {
    const {
      lotId,
      packagingType,
      quantity,
      productionDate,
      bestBeforeDate,
      temperature,
    } = req.body;

    const lot = await Lot.findByPk(lotId);
    if (!lot) {
      return res.status(404).json({ error: 'Lot not found' });
    }

    // Generate final QR code
    const finalQRData = {
      lotId,
      packagingDate: new Date().toISOString(),
      productType: lot.productType,
      quantity,
      bestBeforeDate,
      packagingType,
    };

    const qrCodeFinal = await QRCode.toDataURL(JSON.stringify(finalQRData));

    const packaging = await Packaging.create({
      lotId,
      packagingType,
      quantity,
      productionDate,
      bestBeforeDate,
      qrCodeFinal,
      temperature,
      status: 'packaged',
      operatorId: req.user.id,
    });

    // Update lot status
    await lot.update({ status: 'packaging' });

    res.status(201).json({
      packaging,
      qrCode: qrCodeFinal,
      message: 'Product packaged with final QR code generated',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Label packaging
const labelPackaging = async (req, res) => {
  try {
    const { packagingId, label } = req.body;

    const packaging = await Packaging.findByPk(packagingId);
    if (!packaging) {
      return res.status(404).json({ error: 'Packaging not found' });
    }

    await packaging.update({
      label,
      status: 'labeled',
    });

    res.json({
      packaging,
      message: 'Packaging labeled',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark ready for storage
const readyForStorage = async (req, res) => {
  try {
    const { packagingId } = req.params;

    const packaging = await Packaging.findByPk(packagingId);
    if (!packaging) {
      return res.status(404).json({ error: 'Packaging not found' });
    }

    await packaging.update({ status: 'ready_for_storage' });

    const lot = await Lot.findByPk(packaging.lotId);
    await lot.update({ status: 'storage' });

    res.json({
      packaging,
      message: 'Product ready for storage',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all packagings
const getPackagings = async (req, res) => {
  try {
    const packagings = await Packaging.findAll({
      order: [['packagingDate', 'DESC']],
    });
    res.json(packagings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get packagings by lot
const getPackagingsByLot = async (req, res) => {
  try {
    const { lotId } = req.params;
    const packagings = await Packaging.findAll({
      where: { lotId },
      order: [['packagingDate', 'DESC']],
    });
    res.json(packagings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPackaging,
  labelPackaging,
  readyForStorage,
  getPackagings,
  getPackagingsByLot,
};
