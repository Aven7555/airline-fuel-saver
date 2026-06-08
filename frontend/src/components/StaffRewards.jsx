import { useState, useEffect } from 'react';

function StaffRewards() {
  const [staff, setStaff] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [rewards, setRewards] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/staff');
      const data = await response.json();
      setStaff(data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const fetchRewards = async (staffId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/staff/${staffId}/rewards`);
      const data = await response.json();
      setRewards(data);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStaffSelect = (staffId) => {
    setSelectedStaffId(staffId);
    fetchRewards(staffId);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">🏆 Staff Rewards & Commission</h2>
        <p className="text-gray-600 mb-6">Track individual staff member fuel-saving rewards</p>

        {/* Staff Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {staff.map(member => (
            <button
              key={member.id}
              onClick={() => handleStaffSelect(member.id)}
              className={`p-4 rounded-lg border-2 transition text-left ${
                selectedStaffId === member.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <p className="font-semibold text-gray-900">{member.name}</p>
              <p className="text-sm text-gray-600">{member.role}</p>
              <p className="text-xs text-gray-500 mt-1">{member.id}</p>
            </button>
          ))}
        </div>

        {/* Rewards Display */}
        {selectedStaffId && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-8">Loading rewards data...</div>
            ) : rewards ? (
              <>
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                    <p className="text-gray-700 text-sm font-medium">Total Commission</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                      ${rewards.totalCommission.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                    <p className="text-gray-700 text-sm font-medium">Flights Completed</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{rewards.flightCount}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                    <p className="text-gray-700 text-sm font-medium">Total Fuel Saved</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">{rewards.totalFuelSaved} kg</p>
                  </div>
                </div>

                {/* Reward History */}
                {rewards.rewards.length > 0 ? (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Reward History</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Flight</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Fuel Saved</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-700">Commission</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {rewards.rewards.map((reward, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900">{reward.flightNumber}</td>
                              <td className="px-4 py-3 text-green-600 font-semibold">{reward.fuelSaved} kg</td>
                              <td className="px-4 py-3 text-right font-bold text-blue-600">
                                ${reward.commission.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-gray-600 text-sm">
                                {new Date(reward.date).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                    ℹ️ No rewards recorded yet for this staff member.
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">Unable to load rewards data</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffRewards;
