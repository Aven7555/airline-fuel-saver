import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import FlightImport from './components/FlightImport';
import FlightArrival from './components/FlightArrival';
import StaffRewards from './components/StaffRewards';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await fetch('/api/flights');
      const data = await response.json();
      setFlights(data);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  };

  const handleFlightImported = () => {
    fetchFlights();
    setActiveTab('dashboard');
  };

  const handleArrivalRecorded = () => {
    fetchFlights();
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">✈️ Airline Fuel Saver</h1>
              <p className="text-blue-100">Staff Reward Tool for Fuel Efficiency</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 h-16 items-center">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                activeTab === 'dashboard'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                activeTab === 'import'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📥 Import Flight Plan
            </button>
            <button
              onClick={() => setActiveTab('arrival')}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                activeTab === 'arrival'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              ✅ Record Arrival
            </button>
            <button
              onClick={() => setActiveTab('rewards')}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                activeTab === 'rewards'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              🏆 Staff Rewards
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard flights={flights} />}
        {activeTab === 'import' && <FlightImport onFlightImported={handleFlightImported} />}
        {activeTab === 'arrival' && <FlightArrival flights={flights} onArrivalRecorded={handleArrivalRecorded} />}
        {activeTab === 'rewards' && <StaffRewards />}
      </main>
    </div>
  );
}

export default App;
