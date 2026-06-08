import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory storage (demo)
let flights = [];

// Commission rate: 5% of saved fuel value
const COMMISSION_RATE = 0.05;
const FUEL_PRICE_PER_KG = 0.8; // USD per kg

// POST: Import flight plan from dispatcher
router.post('/import', (req, res) => {
  try {
    const { flightNumber, aircraft, route, plannedFuel, dispatchStaff, departureTime } = req.body;

    if (!flightNumber || !plannedFuel || !dispatchStaff) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const flight = {
      id: uuidv4(),
      flightNumber,
      aircraft: aircraft || 'Boeing 737',
      route: route || 'Unknown',
      plannedFuel: parseFloat(plannedFuel),
      actualFuel: null,
      dispatchStaff,
      departureTime: departureTime || new Date().toISOString(),
      arrivalTime: null,
      status: 'PLANNED',
      fuelSaved: 0,
      commission: 0,
      createdAt: new Date().toISOString(),
    };

    flights.push(flight);
    res.status(201).json(flight);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Record flight arrival with actual fuel usage
router.post('/arrival', (req, res) => {
  try {
    const { flightId, actualFuel } = req.body;

    if (!flightId || actualFuel === undefined) {
      return res.status(400).json({ error: 'Missing flightId or actualFuel' });
    }

    const flight = flights.find(f => f.id === flightId);
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    // Calculate fuel saved
    const fuelSaved = Math.max(0, flight.plannedFuel - parseFloat(actualFuel));
    const commission = fuelSaved * FUEL_PRICE_PER_KG * COMMISSION_RATE;

    flight.actualFuel = parseFloat(actualFuel);
    flight.fuelSaved = fuelSaved;
    flight.commission = commission;
    flight.status = 'ARRIVED';
    flight.arrivalTime = new Date().toISOString();

    res.json(flight);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Get flight details
router.get('/:id', (req, res) => {
  const flight = flights.find(f => f.id === req.params.id);
  if (!flight) {
    return res.status(404).json({ error: 'Flight not found' });
  }
  res.json(flight);
});

// GET: List all flights
router.get('/', (req, res) => {
  res.json(flights);
});

// GET: Get flights by staff
router.get('/staff/:staffId', (req, res) => {
  const staffFlights = flights.filter(f => f.dispatchStaff === req.params.staffId);
  res.json(staffFlights);
});

export default router;
