const express = require('express');
const receptionController = require('../controllers/receptionController');
const cuttingController = require('../controllers/cuttingController');
const packagingController = require('../controllers/packagingController');
const orderController = require('../controllers/orderController');
const shippingController = require('../controllers/shippingController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// ===== RECEPTION ROUTES =====
router.post('/reception', authorizeRole(['quality_manager', 'admin', 'director', 'production_manager']), receptionController.createReception);
router.get('/reception', receptionController.getReceptions);
router.get('/reception/:id', receptionController.getReceptionById);

// ===== CUTTING ROUTES =====
router.post('/cutting', authorizeRole(['operator', 'production_manager', 'admin', 'director']), cuttingController.createCutting);
router.patch('/cutting/:id/complete', authorizeRole(['operator', 'production_manager', 'admin', 'director']), cuttingController.completeCutting);
router.get('/cutting', cuttingController.getCuttings);
router.get('/cutting/lot/:lotId', cuttingController.getCuttingsByLot);

// ===== PACKAGING ROUTES =====
router.post('/packaging', authorizeRole(['operator', 'production_manager', 'admin', 'director']), packagingController.createPackaging);
router.patch('/packaging/:id/label', authorizeRole(['operator', 'admin', 'director']), packagingController.labelPackaging);
router.patch('/packaging/:id/ready', authorizeRole(['operator', 'admin', 'director']), packagingController.readyForStorage);
router.get('/packaging', packagingController.getPackagings);
router.get('/packaging/lot/:lotId', packagingController.getPackagingsByLot);

// ===== ORDER ROUTES =====
router.post('/order', authorizeRole(['sales', 'admin', 'production_manager', 'director']), orderController.createOrder);
router.get('/order', orderController.getOrders);
router.get('/order/:id', orderController.getOrderById);
router.patch('/order/:id/prepare', authorizeRole(['production_manager', 'admin', 'director']), orderController.prepareOrder);

// ===== SHIPPING ROUTES =====
router.post('/shipping', authorizeRole(['production_manager', 'admin', 'sales', 'director']), shippingController.createShipment);
router.patch('/shipping/:id/delivered', authorizeRole(['admin', 'production_manager', 'director']), shippingController.confirmDelivery);
router.get('/shipping', shippingController.getShipments);
router.get('/shipping/:id', shippingController.getShipmentById);

module.exports = router;
