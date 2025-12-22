const Shipping = require('../models/Shipping');
const Order = require('../models/Order');
const Lot = require('../models/Lot');

// Create shipment
const createShipment = async (req, res) => {
  try {
    const {
      orderId,
      lotId,
      quantity,
      temperatureAtShipping,
      carrier,
      trackingNumber,
      expectedDeliveryDate,
    } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const shippingNumber = `SHIP-${Date.now()}`;

    const shipping = await Shipping.create({
      shippingNumber,
      orderId,
      lotId,
      quantity,
      temperatureAtShipping,
      carrier,
      trackingNumber,
      expectedDeliveryDate,
      status: 'in_transit',
    });

    // Update order status
    await order.update({ status: 'shipped' });

    // Update lot status
    if (lotId) {
      const lot = await Lot.findByPk(lotId);
      if (lot) {
        await lot.update({ status: 'shipped' });
      }
    }

    res.status(201).json({
      shipping,
      message: 'Shipment created and in transit',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Confirm delivery
const confirmDelivery = async (req, res) => {
  try {
    const { shippingId } = req.params;

    const shipping = await Shipping.findByPk(shippingId);
    if (!shipping) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    await shipping.update({
      status: 'delivered',
      actualDeliveryDate: new Date(),
    });

    const order = await Order.findByPk(shipping.orderId);
    await order.update({ status: 'delivered' });

    res.json({
      shipping,
      message: 'Delivery confirmed',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all shipments
const getShipments = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};

    const shipments = await Shipping.findAll({
      where,
      order: [['shippingDate', 'DESC']],
    });

    res.json(shipments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get shipment by ID
const getShipmentById = async (req, res) => {
  try {
    const shipping = await Shipping.findByPk(req.params.id);
    if (!shipping) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    res.json(shipping);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createShipment,
  confirmDelivery,
  getShipments,
  getShipmentById,
};
