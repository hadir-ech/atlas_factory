const express = require('express');
const iotController = require('../controllers/iotController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, iotController.getSensors);
router.get('/:id', authenticateToken, iotController.getSensorById);
router.post('/', authenticateToken, iotController.createSensor);
router.patch('/:id/reading', authenticateToken, iotController.updateSensorReading);

module.exports = router;
