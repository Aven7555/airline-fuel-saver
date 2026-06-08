import { useState } from 'react';

function FlightArrival({ flights, onArrivalRecorded }) {
  const [selectedFlightId, setSelectedFlightId] = useState('');
  const [actualFuel, setActualFuel] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [arrivalData, setArrivalData] = useState(null);

  const plannedFlights = flights.filter(f => f.status === 'PLANNED');
  const selectedFlight = flights.find(f => f.id === selectedFlightId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/flights/arrival', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flightId: selectedFlightId,
          actualFuel: parseFloat(actualFuel),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setArrivalData(data);
        setMessage(`✅ Arrival recorded! Fuel saved: ${data.fuelSaved} kg | Commission: $${data.commission.toFixed(2)}`);
        
        // Reset form
        setSelectedFlightId('');
        setActualFuel('');

        // Redirect after success
        setTimeout(() => {
          onArrivalRecorded();
        }, 2000);
      } else {
        setMessage('❌ Error recording arrival. Please try again.');
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">✅ Record Flight Arrival</h2>
        <p className="text-gray-600 mb-6">Enter actual fuel consumed upon arrival</p>

        {plannedFlights.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
            ℹ️ No planned flights available. Please import a flight plan first.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Select Flight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Flight *
              </label>
              <select
                value={selectedFlightId}
                onChange={(e) => {
                  setSelectedFlightId(e.target.value);
                  setArrivalData(null);
                }}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Select a flight --</option>
                {plannedFlights.map(flight => (
                  <option key={flight.id} value={flight.id}>
                    {flight.flightNumber} ({flight.route}) - Planned: {flight.plannedFuel}kg
                  </option>
                ))}
              </select>
            </div>

            {/* Flight Details Preview */}
            {selectedFlight && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Flight Number</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedFlight.flightNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Aircraft</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedFlight.aircraft}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Route</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedFlight.route}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Planned Fuel</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedFlight.plannedFuel} kg</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actual Fuel */}
            {selectedFlight && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actual Fuel Used (kg) *
                </label>
                <input
                  type="number"
                  value={actualFuel}
                  onChange={(e) => setActualFuel(e.target.value)}
                  placeholder={`Enter value (0-${selectedFlight.plannedFuel})`}
                  min="0"
                  max={selectedFlight.plannedFuel}
                  step="1"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Enter the actual fuel consumed from the flight recorder
                </p>
              </div>
            )}

            {/* Calculation Preview */}
            {selectedFlight && actualFuel && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Fuel Saved</p>
                    <p className="text-2xl font-bold text-green-600">
                      {(selectedFlight.plannedFuel - parseFloat(actualFuel || 0)).toFixed(2)} kg
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Commission (5%)</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ${((selectedFlight.plannedFuel - parseFloat(actualFuel || 0)) * 0.8 * 0.05).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}

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
            {selectedFlight && (
              <button
                type="submit"
                disabled={loading || !actualFuel}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                {loading ? 'Recording...' : '✅ Record Arrival'}
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

export default FlightArrival;
