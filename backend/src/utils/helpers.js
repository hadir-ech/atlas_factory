const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const generateQRCode = async (lotNumber) => {
  try {
    const qrCode = await QRCode.toDataURL(lotNumber);
    return qrCode;
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
};

const generateLotNumber = () => {
  return `LOT-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
};

const calculateTRG = (plannedQuantity, actualQuantity, downtime) => {
  // TRG = (Actual Quantity / Planned Quantity) * (Operating Time / Total Time)
  if (plannedQuantity === 0) return 0;
  return (actualQuantity / plannedQuantity) * ((plannedQuantity - downtime) / plannedQuantity) * 100;
};

module.exports = {
  generateQRCode,
  generateLotNumber,
  calculateTRG,
};
