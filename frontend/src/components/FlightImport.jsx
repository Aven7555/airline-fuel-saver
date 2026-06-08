import { useState } from 'react';

function FlightImport({ onFlightImported }) {
  const [formData, setFormData] = useState({
    flightNumber: '',
    aircraft: 'Boeing 737',
    route: '',
    plannedFuel: '',
    dispatchStaff: 'STAFF001',
    departureTime: new Date().toISOString().slice(0, 16),
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const staffOptions = [
    { id: 'STAFF001', name: 'John Smith - Dispatcher' },
    { id: 'STAFF002', name: 'Sarah Johnson - Dispatcher' },
    { id: 'STAFF003', name: 'Mike Davis - Pilot' },
  ];

  const aircraftOptions = [
    'Boeing 737',
    'Boeing 777',
    'Airbus A320',
    'Airbus A350',
    'Embraer E190',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/flights/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`✅ Flight ${data.flightNumber} imported successfully!`);
        
        // Reset form
        setFormData({
          flightNumber: '',
          aircraft: 'Boeing 737',
          route: '',
          plannedFuel: '',
          dispatchStaff: 'STAFF001',
          departureTime: new Date().toISOString().slice(0, 16),
        });

        // Redirect after success
        setTimeout(() => {
          onFlightImported();
        }, 1500);
      } else {
        setMessage('❌ Error importing flight. Please check your input.');
      }
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">📥 Import Flight Plan</h2>
        <p className="text-gray-600 mb-6">Enter flight plan details from dispatcher</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Flight Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flight Number *
              </label>
              <input
                type="text"
                name="flightNumber"
                value={formData.flightNumber}
                onChange={handleChange}
                placeholder="e.g., AA101"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Aircraft */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aircraft *
              </label>
              <select
                name="aircraft"
                value={formData.aircraft}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {aircraftOptions.map(aircraft => (
                  <option key={aircraft} value={aircraft}>{aircraft}</option>
                ))}
              </select>
            </div>

            {/* Route */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Route (FROM-TO) *
              </label>
              <input
                type="text"
                name="route"
                value={formData.route}
                onChange={handleChange}
                placeholder="e.g., JFK-LAX"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Planned Fuel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Planned Fuel (kg) *
              </label>
              <input
                type="number"
                name="plannedFuel"
                value={formData.plannedFuel}
                onChange={handleChange}
                placeholder="e.g., 5000"
                min="100"
                step="10"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Dispatch Staff */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dispatch Staff *
              </label>
              <select
                name="dispatchStaff"
                value={formData.dispatchStaff}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {staffOptions.map(staff => (
                  <option key={staff.id} value={staff.id}>{staff.name}</option>
                ))}
              </select>
            </div>

            {/* Departure Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departure Time *
              </label>
              <input
                type="datetime-local"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg ${
              message.includes('✅')
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            {loading ? 'Importing...' : '📥 Import Flight Plan'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FlightImport;
