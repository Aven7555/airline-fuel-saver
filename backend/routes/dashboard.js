import express from 'express';

const router = express.Router();

// Mock flights and staff data
const mockFlights = [
  {
    id: '1',
    flightNumber: 'AA101',
    plannedFuel: 5000,
    actualFuel: 4800,
    fuelSaved: 200,
    commission: 80,
    dispatchStaff: 'STAFF001',
    status: 'ARRIVED'
  },
  {
    id: '2',
    flightNumber: 'AA102',
    plannedFuel: 4500,
    actualFuel: 4300,
    fuelSaved: 200,
    commission: 80,
    dispatchStaff: 'STAFF002',
    status: 'ARRIVED'
  }
];

// GET: Dashboard analytics
router.get('/', (req, res) => {
  const totalFlights = mockFlights.length;
  const totalFuelSaved = mockFlights.reduce((sum, f) => sum + (f.fuelSaved || 0), 0);
  const totalCommission = mockFlights.reduce((sum, f) => sum + (f.commission || 0), 0);
  const avgFuelSaved = totalFlights > 0 ? totalFuelSaved / totalFlights : 0;

  const staffStats = {};
  mockFlights.forEach(flight => {
    if (!staffStats[flight.dispatchStaff]) {
      staffStats[flight.dispatchStaff] = {
        staffId: flight.dispatchStaff,
        flightCount: 0,
        totalCommission: 0,
        totalFuelSaved: 0
      };
    }
    staffStats[flight.dispatchStaff].flightCount += 1;
    staffStats[flight.dispatchStaff].totalCommission += flight.commission;
    staffStats[flight.dispatchStaff].totalFuelSaved += flight.fuelSaved;
  });

  res.json({
    summary: {
      totalFlights,
      totalFuelSaved: totalFuelSaved.toFixed(2),
      totalCommission: totalCommission.toFixed(2),
      avgFuelSaved: avgFuelSaved.toFixed(2)
    },
    staffStats: Object.values(staffStats),
    recentFlights: mockFlights.slice(-5)
  });
});

export default router;
