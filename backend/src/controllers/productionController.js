const Production = require('../models/Production');
const Lot = require('../models/Lot');

// Create production operation
exports.createOperation = async (req, res) => {
  try {
    const { lotId, operation, inputQuantity, outputQuantity, operatorNotes, temperatureMaintained, duration } = req.body;

    // Validate lot exists
    const lot = await Lot.findByPk(lotId);
    if (!lot) {
      return res.status(404).json({ error: 'Lot not found' });
    }

    // Create production operation
    const productionOp = await Production.create({
      lotId,
      operation,
      inputQuantity: parseFloat(inputQuantity),
      outputQuantity: parseFloat(outputQuantity),
      operatorNotes,
      temperatureMaintained: temperatureMaintained ? parseFloat(temperatureMaintained) : null,
      duration: parseInt(duration),
      operatorId: req.user.id,
      status: 'completed',
    });

    // Update lot status
    await lot.update({ status: 'transformation' });

    console.log('✓ Production operation created:', productionOp.id);
    res.status(201).json({ 
      success: true, 
      message: 'Production operation recorded',
      operation: productionOp 
    });
  } catch (error) {
    console.error('Error creating production operation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all production operations
exports.getOperations = async (req, res) => {
  try {
    const operations = await Production.findAll({
      order: [['createdAt', 'DESC']],
    });
    console.log(`✓ Fetched ${operations.length} production operations`);
    res.json(operations);
  } catch (error) {
    console.error('Error fetching production operations:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get production operation by ID
exports.getOperationById = async (req, res) => {
  try {
    const operation = await Production.findByPk(req.params.id);
    if (!operation) {
      return res.status(404).json({ error: 'Production operation not found' });
    }
    res.json(operation);
  } catch (error) {
    console.error('Error fetching production operation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get operations by lot
exports.getOperationsByLot = async (req, res) => {
  try {
    const operations = await Production.findAll({
      where: { lotId: req.params.lotId },
      order: [['createdAt', 'DESC']],
    });
    console.log(`✓ Fetched ${operations.length} operations for lot ${req.params.lotId}`);
    res.json(operations);
  } catch (error) {
    console.error('Error fetching lot operations:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update operation status
exports.updateOperationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const operation = await Production.findByPk(req.params.id);

    if (!operation) {
      return res.status(404).json({ error: 'Production operation not found' });
    }

    await operation.update({ status });
    console.log(`✓ Operation ${req.params.id} status updated to ${status}`);
    res.json({ success: true, message: 'Operation status updated', operation });
  } catch (error) {
    console.error('Error updating operation status:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get production statistics
exports.getStatistics = async (req, res) => {
  try {
    const operations = await Production.findAll();
    
    const totalYield = operations.reduce((sum, op) => {
      if (op.inputQuantity && op.outputQuantity) {
        return sum + (op.outputQuantity / op.inputQuantity) * 100;
      }
      return sum;
    }, 0);

    const averageYield = operations.length > 0 ? totalYield / operations.length : 0;
    
    const stats = {
      totalOperations: operations.length,
      averageYield: averageYield.toFixed(1),
      completedOperations: operations.filter(op => op.status === 'completed').length,
      inProgressOperations: operations.filter(op => op.status === 'in_progress').length,
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: error.message });
  }
};
