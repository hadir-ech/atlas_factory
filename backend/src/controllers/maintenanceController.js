const Machine = require('../models/Machine');
const sequelize = require('../config/sequelize');

// Report maintenance intervention
const reportIntervention = async (req, res) => {
  try {
    const {
      machineId,
      problemDescription,
      severity,
      problemType,
      attachments,
    } = req.body;

    // Verify machine exists
    const machine = await Machine.findByPk(machineId);
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    // Create intervention record as a machine history entry
    const intervention = {
      id: require('uuid').v4(),
      machineId,
      problemDescription,
      severity,
      problemType,
      attachments,
      reportedBy: req.user.id,
      status: 'reported',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Store in machine interventions JSON field or create separate record
    // For now, we'll update machine status
    await machine.update({
      status: severity === 'critical' ? 'maintenance' : machine.status,
    });

    res.json({ intervention });
  } catch (error) {
    console.error('Error reporting intervention:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all interventions
const getInterventions = async (req, res) => {
  try {
    const machines = await Machine.findAll();
    
    // For now, return mock interventions
    const interventions = [];
    
    res.json(interventions);
  } catch (error) {
    console.error('Error fetching interventions:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all machines
const getMachines = async (req, res) => {
  try {
    const machines = await Machine.findAll();
    res.json(machines);
  } catch (error) {
    console.error('Error fetching machines:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update machine status
const updateMachineStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const machine = await Machine.findByPk(id);
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    await machine.update({ status });
    res.json({ machine });
  } catch (error) {
    console.error('Error updating machine:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  reportIntervention,
  getInterventions,
  getMachines,
  updateMachineStatus,
};
