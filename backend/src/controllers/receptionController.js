const Reception = require('../models/Reception');
const Lot = require('../models/Lot');
const QualityControl = require('../models/QualityControl');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

// Create reception and initial quality control
const createReception = async (req, res) => {
  try {
    const {
      supplier,
      productType,
      quantity,
      slaughterDate,
      transportTemperature,
      sanitaryCertificate,
      visualControl,
      smellControl,
      temperatureControl,
      coldChainVerified,
    } = req.body;

    const reception = await Reception.create({
      supplier,
      productType,
      quantity,
      slaughterDate,
      transportTemperature,
      sanitaryCertificate,
      visualControl,
      smellControl,
      temperatureControl,
      coldChainVerified,
      checkedBy: req.user.id,
      checkedAt: new Date(),
      status: 'received',
    });

    // If all controls pass, accept the reception
    const allControlsPass = visualControl && smellControl && coldChainVerified;
    
    if (allControlsPass) {
      reception.status = 'accepted';
      await reception.save();

      // Create lot with QR code
      const lotNumber = `LOT-${Date.now()}`;
      const qrData = {
        lotNumber,
        origin: supplier,
        date: new Date().toISOString(),
        productType,
        quantity,
        controls: {
          visual: visualControl,
          smell: smellControl,
          temperature: temperatureControl,
          coldChain: coldChainVerified,
        },
      };

      const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

      const lot = await Lot.create({
        lotNumber,
        qrCode,
        productType,
        quantity,
        status: 'received',
        temperature: temperatureControl,
        notes: `Reception from ${supplier}`,
      });

      // Create initial quality control record
      await QualityControl.create({
        lotId: lot.id,
        checkType: 'material_reception',
        status: 'passed',
        temperature: temperatureControl,
        notes: `Initial reception check - all controls passed`,
        checkedBy: req.user.id,
        checkedAt: new Date(),
      });

      res.status(201).json({
        reception,
        lot: {
          id: lot.id,
          lotNumber: lot.lotNumber,
          qrCode: lot.qrCode,
        },
        message: 'Reception accepted and lot created',
      });
    } else {
      // Mark as rejected if controls fail
      reception.status = 'rejected';
      await reception.save();

      res.status(400).json({
        reception,
        message: 'Reception rejected - Quality controls failed',
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all receptions
const getReceptions = async (req, res) => {
  try {
    const receptions = await Reception.findAll({
      order: [['receptionDate', 'DESC']],
    });
    res.json(receptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get reception by ID
const getReceptionById = async (req, res) => {
  try {
    const reception = await Reception.findByPk(req.params.id);
    if (!reception) {
      return res.status(404).json({ error: 'Reception not found' });
    }
    res.json(reception);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReception,
  getReceptions,
  getReceptionById,
};
