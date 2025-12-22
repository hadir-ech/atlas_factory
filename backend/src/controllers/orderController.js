const Order = require('../models/Order');
const Shipping = require('../models/Shipping');
const Lot = require('../models/Lot');

// Create order (from commercial)
const createOrder = async (req, res) => {
  try {
    const {
      clientName,
      clientType,
      deliveryDate,
      productType,
      quantity,
      address,
      phone,
      notes,
    } = req.body;

    const orderNumber = `ORD-${Date.now()}`;

    const order = await Order.create({
      orderNumber,
      clientName,
      clientType,
      deliveryDate,
      productType,
      quantity,
      address,
      phone,
      notes,
      status: 'confirmed',
    });

    res.status(201).json({
      order,
      message: 'Order created and ready for preparation',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all orders
const getOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};

    const orders = await Order.findAll({
      where,
      order: [['orderDate', 'DESC']],
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Prepare order (select lots FIFO)
const prepareOrder = async (req, res) => {
  try {
    const { orderId, lotIds } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Get lots (should be FIFO - oldest first)
    const selectedLots = await Lot.findAll({
      where: { id: lotIds },
    });

    // Verify quantities match
    const totalQuantity = selectedLots.reduce((sum, lot) => sum + parseFloat(lot.quantity), 0);
    if (totalQuantity < order.quantity) {
      return res.status(400).json({ error: 'Insufficient quantity in selected lots' });
    }

    // Generate delivery slip
    const deliverySlip = {
      orderNumber: order.orderNumber,
      clientName: order.clientName,
      deliveryDate: order.deliveryDate,
      lots: selectedLots.map(lot => ({
        lotNumber: lot.lotNumber,
        quantity: lot.quantity,
        bestBeforeDate: lot.completedAt,
      })),
      totalQuantity,
      generatedAt: new Date(),
    };

    await order.update({ status: 'ready' });

    res.json({
      order,
      deliverySlip,
      message: 'Order prepared and delivery slip generated',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  prepareOrder,
};
