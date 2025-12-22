const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// All dashboard routes require authentication
router.use(authenticateToken);

// Director dashboard - global KPIs
router.get('/director', authorizeRole(['director', 'admin']), dashboardController.getDirectorDashboard);

// Analytics endpoints (accessible by director and supervisors)
router.get('/production', authorizeRole(['director', 'production_manager', 'admin']), dashboardController.getProductionAnalytics);
router.get('/quality', authorizeRole(['director', 'quality_manager', 'admin']), dashboardController.getQualityAnalytics);
router.get('/machines', authorizeRole(['director', 'technician', 'admin']), dashboardController.getMachineAnalytics);
router.get('/temperature', authorizeRole(['director', 'quality_manager', 'admin']), dashboardController.getTemperatureHistory);

module.exports = router;
