import { useEffect, useState } from 'react';

function Dashboard({ flights }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [flights]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="text-center py-8">No data available</div>;
  }

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="text-4xl opacity-20">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Flights"
          value={stats.summary.totalFlights}
          icon="✈️"
          color="border-blue-500"
        />
        <StatCard
          title="Total Fuel Saved"
          value={`${stats.summary.totalFuelSaved} kg`}
          icon="⛽"
          color="border-green-500"
        />
        <StatCard
          title="Total Commission"
          value={`$${stats.summary.totalCommission}`}
          icon="💰"
          color="border-yellow-500"
        />
        <StatCard
          title="Avg Fuel Saved/Flight"
          value={`${stats.summary.avgFuelSaved} kg`}
          icon="📊"
          color="border-purple-500"
        />
      </div>

      {/* Staff Performance */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">👥 Staff Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Staff ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Flights</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Fuel Saved (kg)</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Commission ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats.staffStats.map((staff) => (
                <tr key={staff.staffId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{staff.staffId}</td>
                  <td className="px-4 py-3 text-gray-600">{staff.flightCount}</td>
                  <td className="px-4 py-3 text-gray-600">{staff.totalFuelSaved}</td>
                  <td className="px-4 py-3 text-right font-semibold text-green-600">
                    ${staff.totalCommission.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Flights */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Recent Flights</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Flight</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Planned Fuel</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Actual Fuel</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Saved</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats.recentFlights.map((flight) => (
                <tr key={flight.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{flight.flightNumber}</td>
                  <td className="px-4 py-3 text-gray-600">{flight.plannedFuel} kg</td>
                  <td className="px-4 py-3 text-gray-600">{flight.actualFuel || '-'} kg</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">{flight.fuelSaved} kg</td>
                  <td className="px-4 py-3 text-right font-semibold text-blue-600">
                    ${flight.commission.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
