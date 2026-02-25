import QuoteCalculator from './components/QuoteCalculator';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation Bar */}
      <header className="bg-teal-700 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wide">River Breeze Domestic Detailing</h1>
          <button className="bg-white text-teal-800 px-5 py-2 rounded-md font-semibold hover:bg-teal-50 transition-colors shadow-sm">
            Admin Login
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-6">
        <QuoteCalculator />
      </main>
    </div>
  );
}

export default App;