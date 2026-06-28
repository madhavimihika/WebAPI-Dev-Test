const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Load seed data into memory at startup
const seedData = require('./police_tuktuk_seed_data.json');

// Helper function to find an item by ID in an array
const findById = (array, id) => {
  const item = array.find(item => item.id === parseInt(id));
  if (!item) {
    return null;
  }
  return item;
};

// ============= ROUTES =============

// GET /provinces
app.get('/provinces', (req, res) => {
  res.json(seedData.provinces);
});

// GET /provinces/:provinceId
app.get('/provinces/:provinceId', (req, res) => {
  const province = findById(seedData.provinces, req.params.provinceId);
  if (!province) {
    return res.status(404).json({ message: 'Province not found' });
  }
  res.json(province);
});

// GET /districts
app.get('/districts', (req, res) => {
  res.json(seedData.districts);
});

// GET /districts/:districtId
app.get('/districts/:districtId', (req, res) => {
  const district = findById(seedData.districts, req.params.districtId);
  if (!district) {
    return res.status(404).json({ message: 'District not found' });
  }
  res.json(district);
});

// GET /stations
app.get('/stations', (req, res) => {
  res.json(seedData.stations);
});

// GET /stations/:stationId
app.get('/stations/:stationId', (req, res) => {
  const station = findById(seedData.stations, req.params.stationId);
  if (!station) {
    return res.status(404).json({ message: 'Station not found' });
  }
  res.json(station);
});

// GET /vehicles
app.get('/vehicles', (req, res) => {
  res.json(seedData.vehicles);
});

// GET /vehicles/:vehicleId
app.get('/vehicles/:vehicleId', (req, res) => {
  const vehicle = findById(seedData.vehicles, req.params.vehicleId);
  if (!vehicle) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  res.json(vehicle);
});

// GET /vehicles/:vehicleId/pings
app.get('/vehicles/:vehicleId/pings', (req, res) => {
  const vehicle = findById(seedData.vehicles, req.params.vehicleId);
  if (!vehicle) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  
  const pings = seedData.pings.filter(ping => ping.vehicle_id === parseInt(req.params.vehicleId));
  res.json(pings);
});

// ============= START SERVER =============
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Loaded ${seedData.provinces.length} provinces`);
  console.log(`Loaded ${seedData.districts.length} districts`);
  console.log(`Loaded ${seedData.stations.length} stations`);
  console.log(`Loaded ${seedData.vehicles.length} vehicles`);
  console.log(`Loaded ${seedData.pings.length} pings`);
});