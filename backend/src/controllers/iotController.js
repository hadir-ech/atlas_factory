const IoTSensor = require('../models/IoTSensor');

const getSensors = async (req, res) => {
  try {
    const sensors = await IoTSensor.findAll({
      where: { active: true },
    });
    res.json(sensors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSensorById = async (req, res) => {
  try {
    const sensor = await IoTSensor.findByPk(req.params.id);
    if (!sensor) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    res.json(sensor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSensor = async (req, res) => {
  try {
    const { sensorId, sensorName, location, type, minThreshold, maxThreshold, unit } = req.body;
    const sensor = await IoTSensor.create({
      sensorId,
      sensorName,
      location,
      type,
      minThreshold,
      maxThreshold,
      unit,
    });
    res.status(201).json(sensor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSensorReading = async (req, res) => {
  try {
    const { currentValue } = req.body;
    const sensor = await IoTSensor.findByPk(req.params.id);
    if (!sensor) {
      return res.status(404).json({ error: 'Sensor not found' });
    }

    await sensor.update({
      currentValue,
      lastReadAt: new Date(),
    });

    // Check for threshold violations
    let alert = null;
    if (sensor.minThreshold && currentValue < sensor.minThreshold) {
      alert = `ALERT: Sensor ${sensor.sensorName} reading ${currentValue}${sensor.unit} is below minimum threshold ${sensor.minThreshold}`;
    }
    if (sensor.maxThreshold && currentValue > sensor.maxThreshold) {
      alert = `ALERT: Sensor ${sensor.sensorName} reading ${currentValue}${sensor.unit} is above maximum threshold ${sensor.maxThreshold}`;
    }

    res.json({ sensor, alert });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getSensors,
  getSensorById,
  createSensor,
  updateSensorReading,
};
