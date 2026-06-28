const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Load seed data once at startup
const seedData = JSON.parse(
  fs.readFileSync('./police_tuktuk_seed_data.json', 'utf8')
);

// Helper function to find an item by ID in an array
const findById = (array, id) => {
  const item = array.find(item => item.id === parseInt(id));
  if (!item) {
    return null;
  }
  return item;
};

// ============= ROUTES =============

// GET / - Welcome message
app.get('/', (req, res) => {
  res.json({
    message: 'Police TukTuk API',
    version: '1.0.0',
    endpoints: [
      { method: 'GET', path: '/provinces' },
      { method: 'GET', path: '/provinces/:provinceId' },
      { method: 'GET', path: '/districts' },
      { method: 'GET', path: '/districts/:districtId' },
      { method: 'GET', path: '/stations' },
      { method: 'GET', path: '/stations/:stationId' },
      { method: 'GET', path: '/vehicles' },
      { method: 'GET', path: '/vehicles/:vehicleId' },
      { method: 'GET', path: '/vehicles/:vehicleId/pings' }
    ]
  });
});

// GET /provinces -> array of { province_id, name }
app.get('/provinces', (req, res) => {
  const result = seedData.provinces.map(p => ({
    province_id: p.id,
    name: p.name
  }));
  res.json(result);
});

// GET /provinces/:provinceId -> { province_id, name }
app.get('/provinces/:provinceId', (req, res) => {
  const province = findById(seedData.provinces, req.params.provinceId);
  if (!province) {
    return res.status(404).json({ message: 'Province not found' });
  }
  res.json({
    province_id: province.id,
    name: province.name
  });
});

// GET /districts -> array of { district_id, name, province_id }
app.get('/districts', (req, res) => {
  const result = seedData.districts.map(d => ({
    district_id: d.id,
    name: d.name,
    province_id: d.province_id
  }));
  res.json(result);
});

// GET /districts/:districtId -> { district_id, name, province_id }
app.get('/districts/:districtId', (req, res) => {
  const district = findById(seedData.districts, req.params.districtId);
  if (!district) {
    return res.status(404).json({ message: 'District not found' });
  }
  res.json({
    district_id: district.id,
    name: district.name,
    province_id: district.province_id
  });
});

// GET /stations -> array of { station_id, name, district_id }
app.get('/stations', (req, res) => {
  const result = seedData.stations.map(s => ({
    station_id: s.id,
    name: s.name,
    district_id: s.district_id
  }));
  res.json(result);
});

// GET /stations/:stationId -> { station_id, name, district_id }
app.get('/stations/:stationId', (req, res) => {
  const station = findById(seedData.stations, req.params.stationId);
  if (!station) {
    return res.status(404).json({ message: 'Station not found' });
  }
  res.json({
    station_id: station.id,
    name: station.name,
    district_id: station.district_id
  });
});

// GET /vehicles -> array of { vehicle_id, reg_number, device_id, station_id }
app.get('/vehicles', (req, res) => {
  const result = seedData.vehicles.map(v => ({
    vehicle_id: v.id,
    reg_number: v.register_number,
    device_id: v.device_id,
    station_id: v.station_id
  }));
  res.json(result);
});

// GET /vehicles/:vehicleId -> { vehicle_id, reg_number, device_id, station_id }
app.get('/vehicles/:vehicleId', (req, res) => {
  const vehicle = findById(seedData.vehicles, req.params.vehicleId);
  if (!vehicle) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  res.json({
    vehicle_id: vehicle.id,
    reg_number: vehicle.register_number,
    device_id: vehicle.device_id,
    station_id: vehicle.station_id
  });
});

// GET /vehicles/:vehicleId/pings -> array of { ping_id, vehicle_id, timestamp, lat, lng, speed }
app.get('/vehicles/:vehicleId/pings', (req, res) => {
  const vehicle = findById(seedData.vehicles, req.params.vehicleId);
  if (!vehicle) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }
  
  const result = seedData.pings
    .filter(ping => ping.vehicle_id === parseInt(req.params.vehicleId))
    .map(p => ({
      ping_id: p.id,
      vehicle_id: p.vehicle_id,
      timestamp: p.timestamp,
      lat: p.latitude,
      lng: p.longitude,
      speed: p.speed || 0
    }));
  res.json(result);
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