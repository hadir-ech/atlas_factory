const express = require('express');
const qualityController = require('../controllers/qualityController');
const maintenanceController = require('../controllers/maintenanceController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// ===== QUALITY CONTROL ROUTES =====
router.post('/quality/controls', authorizeRole(['quality_manager', 'admin', 'director']), qualityController.createQualityControl);
router.get('/quality/controls', qualityController.getQualityControls);
router.get('/quality/controls/:id', qualityController.getQualityControlById);
router.get('/quality/controls/lot/:lotId', qualityController.getQualityControlsByLot);

// ===== MAINTENANCE ROUTES =====
router.post('/maintenance/interventions', authorizeRole(['technician', 'admin', 'director', 'production_manager']), maintenanceController.reportIntervention);
router.get('/maintenance/interventions', maintenanceController.getInterventions);
router.get('/iot/machines', maintenanceController.getMachines);
router.patch('/maintenance/machines/:id/status', authorizeRole(['technician', 'admin', 'director']), maintenanceController.updateMachineStatus);

module.exports = router;
