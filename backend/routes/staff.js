import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Sample staff data
const staff = [
  { id: 'STAFF001', name: 'John Smith', role: 'Dispatcher', totalCommission: 0, flightCount: 0 },
  { id: 'STAFF002', name: 'Sarah Johnson', role: 'Dispatcher', totalCommission: 0, flightCount: 0 },
  { id: 'STAFF003', name: 'Mike Davis', role: 'Pilot', totalCommission: 0, flightCount: 0 },
];

// In-memory storage for tracking
let staffRewards = new Map();

// GET: Get staff rewards/commission
router.get('/:staffId/rewards', (req, res) => {
  const staffId = req.params.staffId;
  const staffMember = staff.find(s => s.id === staffId);
  
  if (!staffMember) {
    return res.status(404).json({ error: 'Staff not found' });
  }

  const rewards = staffRewards.get(staffId) || {
    staffId,
    name: staffMember.name,
    totalCommission: 0,
    flightCount: 0,
    totalFuelSaved: 0,
    rewards: []
  };

  res.json(rewards);
});

// POST: Update staff commission
router.post('/:staffId/update-commission', (req, res) => {
  try {
    const { staffId } = req.params;
    const { commission, fuelSaved, flightNumber } = req.body;

    const staffMember = staff.find(s => s.id === staffId);
    if (!staffMember) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    let rewards = staffRewards.get(staffId) || {
      staffId,
      name: staffMember.name,
      totalCommission: 0,
      flightCount: 0,
      totalFuelSaved: 0,
      rewards: []
    };

    rewards.totalCommission += commission;
    rewards.flightCount += 1;
    rewards.totalFuelSaved += fuelSaved;
    rewards.rewards.push({
      flightNumber,
      commission,
      fuelSaved,
      date: new Date().toISOString()
    });

    staffRewards.set(staffId, rewards);
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: List all staff
router.get('/', (req, res) => {
  res.json(staff);
});

export default router;
