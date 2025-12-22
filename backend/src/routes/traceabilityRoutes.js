const express = require('express');
const traceabilityController = require('../controllers/traceabilityController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, traceabilityController.createLot);
router.get('/', authenticateToken, traceabilityController.getLots);
router.get('/:id', authenticateToken, traceabilityController.getLotById);
router.patch('/:id/status', authenticateToken, traceabilityController.updateLotStatus);

module.exports = router;
