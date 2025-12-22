const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const {
  createOperation,
  getOperations,
  getOperationById,
  getOperationsByLot,
  updateOperationStatus,
  getStatistics,
} = require('../controllers/productionController');

// Create operation - Accessible to operators, production managers, directors
router.post('/production/operations', authenticateToken, authorizeRole(['operator', 'production_manager', 'director', 'admin']), createOperation);

// Get all operations
router.get('/production/operations', authenticateToken, authorizeRole(['operator', 'production_manager', 'director', 'admin', 'quality_manager']), getOperations);

// Get operation by ID
router.get('/production/operations/:id', authenticateToken, authorizeRole(['operator', 'production_manager', 'director', 'admin']), getOperationById);

// Get operations by lot
router.get('/production/operations/lot/:lotId', authenticateToken, authorizeRole(['operator', 'production_manager', 'director', 'admin']), getOperationsByLot);

// Update operation status
router.patch('/production/operations/:id/status', authenticateToken, authorizeRole(['production_manager', 'director', 'admin']), updateOperationStatus);

// Get production statistics
router.get('/production/statistics', authenticateToken, authorizeRole(['director', 'admin', 'production_manager']), getStatistics);

module.exports = router;
