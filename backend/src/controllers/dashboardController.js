const Lot = require('../models/Lot');
const IoTSensor = require('../models/IoTSensor');
const Machine = require('../models/Machine');
const Production = require('../models/Production');
const QualityControl = require('../models/QualityControl');
const { Op } = require('sequelize');

// Director Dashboard - Global overview
const getDirectorDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get today's production data
    const productionToday = await Production.findAll({
      where: {
        productionDate: {
          [Op.gte]: today,
        },
      },
    });

    // Get active lots
    const activeLots = await Lot.findAll({
      where: {
        status: {
          [Op.notIn]: ['shipped', 'quality_blocked'],
        },
      },
    });

    // Get temperature alerts
    const temperatureAlerts = await IoTSensor.findAll({
      where: {
        type: 'temperature',
        status: 'error',
      },
    });

    // Get machines in maintenance
    const machinesInMaintenance = await Machine.findAll({
      where: {
        status: {
          [Op.in]: ['maintenance', 'broken'],
        },
      },
    });

    // Calculate TRG (Taux de Rendement Global)
    let totalPlannedQuantity = 0;
    let totalActualQuantity = 0;
    let totalWastage = 0;

    productionToday.forEach(prod => {
      totalPlannedQuantity += parseFloat(prod.plannedQuantity) || 0;
      totalActualQuantity += parseFloat(prod.actualQuantity) || 0;
      totalWastage += parseFloat(prod.wastage) || 0;
    });

    const trgScore = totalPlannedQuantity > 0 
      ? ((totalActualQuantity / totalPlannedQuantity) * 100).toFixed(2)
      : 0;

    // Get quality controls pending
    const qualityControlsPending = await QualityControl.findAll({
      where: {
        status: 'pending',
      },
    });

    // Get quality failures rate
    const qualityControlsAll = await QualityControl.findAll({
      where: {
        checkedAt: {
          [Op.gte]: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    });

    const failureRate = qualityControlsAll.length > 0
      ? ((qualityControlsAll.filter(q => q.status === 'failed').length / qualityControlsAll.length) * 100).toFixed(2)
      : 0;

    // Get average temperatures from all sensors
    const allSensors = await IoTSensor.findAll({
      where: { type: 'temperature' },
    });

    const avgTemperature = allSensors.length > 0
      ? (allSensors.reduce((sum, s) => sum + (parseFloat(s.currentValue) || 0), 0) / allSensors.length).toFixed(2)
      : 0;

    res.json({
      summary: {
        today: today.toISOString().split('T')[0],
      },
      kpis: {
        production: {
          plannedQuantity: totalPlannedQuantity.toFixed(2),
          actualQuantity: totalActualQuantity.toFixed(2),
          wastage: totalWastage.toFixed(2),
          trgScore: trgScore,
          unit: 'kg',
        },
        quality: {
          failureRate: failureRate,
          controlsPending: qualityControlsPending.length,
          controlsTotal: qualityControlsAll.length,
          percentage: '%',
        },
        temperature: {
          average: avgTemperature,
          alerts: temperatureAlerts.length,
          unit: '°C',
        },
        traceability: {
          activeLots: activeLots.length,
          lotsInCutting: activeLots.filter(l => l.status === 'cutting').length,
          lotsInPackaging: activeLots.filter(l => l.status === 'packaging').length,
        },
        maintenance: {
          machinesOperational: (await Machine.count({ where: { status: 'operational' } })),
          machinesInMaintenance: machinesInMaintenance.length,
          totalMachines: await Machine.count(),
        },
      },
      alerts: {
        critical: [
          ...temperatureAlerts.map(s => ({
            type: 'temperature_alert',
            message: `Temperature sensor ${s.sensorName} in error`,
            severity: 'high',
            timestamp: s.lastReadAt,
          })),
          ...machinesInMaintenance.map(m => ({
            type: 'machine_alert',
            message: `Machine ${m.machineName} requires maintenance`,
            severity: 'medium',
            timestamp: m.updatedAt,
          })),
        ],
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get production analytics
const getProductionAnalytics = async (req, res) => {
  try {
    const { daysBack = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(daysBack));

    const productions = await Production.findAll({
      where: {
        productionDate: {
          [Op.gte]: startDate,
        },
      },
      order: [['productionDate', 'ASC']],
    });

    const analyticsData = {};
    productions.forEach(prod => {
      const date = prod.productionDate.toISOString().split('T')[0];
      if (!analyticsData[date]) {
        analyticsData[date] = {
          date,
          planned: 0,
          actual: 0,
          wastage: 0,
          trg: 0,
        };
      }
      analyticsData[date].planned += parseFloat(prod.plannedQuantity) || 0;
      analyticsData[date].actual += parseFloat(prod.actualQuantity) || 0;
      analyticsData[date].wastage += parseFloat(prod.wastage) || 0;
    });

    // Calculate TRG for each day
    const chartData = Object.values(analyticsData).map(day => ({
      ...day,
      trg: day.planned > 0 ? ((day.actual / day.planned) * 100).toFixed(2) : 0,
    }));

    res.json({ data: chartData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get quality analytics
const getQualityAnalytics = async (req, res) => {
  try {
    const { daysBack = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(daysBack));

    const qualityControls = await QualityControl.findAll({
      where: {
        checkedAt: {
          [Op.gte]: startDate,
        },
      },
    });

    const checkTypes = {};
    qualityControls.forEach(qc => {
      if (!checkTypes[qc.checkType]) {
        checkTypes[qc.checkType] = {
          passed: 0,
          failed: 0,
          pending: 0,
        };
      }
      checkTypes[qc.checkType][qc.status]++;
    });

    const chartData = Object.entries(checkTypes).map(([checkType, counts]) => ({
      checkType,
      ...counts,
      total: counts.passed + counts.failed + counts.pending,
      failureRate: ((counts.failed / (counts.passed + counts.failed + counts.pending)) * 100).toFixed(2),
    }));

    res.json({ data: chartData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get machine availability
const getMachineAnalytics = async (req, res) => {
  try {
    const machines = await Machine.findAll();

    const chartData = machines.map(machine => ({
      id: machine.id,
      name: machine.machineName,
      status: machine.status,
      operationalHours: machine.operationalHours,
      lastMaintenance: machine.lastMaintenanceDate,
      nextMaintenance: machine.nextMaintenanceDate,
    }));

    res.json({ data: chartData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get temperature history
const getTemperatureHistory = async (req, res) => {
  try {
    const { sensorId, hours = 24 } = req.query;
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - parseInt(hours));

    let sensors;
    if (sensorId) {
      sensors = await IoTSensor.findAll({
        where: { id: sensorId },
      });
    } else {
      sensors = await IoTSensor.findAll({
        where: { type: 'temperature' },
      });
    }

    const sensorData = sensors.map(sensor => ({
      id: sensor.id,
      name: sensor.sensorName,
      location: sensor.location,
      currentValue: sensor.currentValue,
      minThreshold: sensor.minThreshold,
      maxThreshold: sensor.maxThreshold,
      status: sensor.status,
      lastRead: sensor.lastReadAt,
    }));

    res.json({ data: sensorData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDirectorDashboard,
  getProductionAnalytics,
  getQualityAnalytics,
  getMachineAnalytics,
  getTemperatureHistory,
};
