import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import CategoryCard from '../../components/CategoryCard';
import TableView from '../../components/TableView';
import SettingsModal from '../../components/SettingsModal';
import { scenarioStorage } from '../../services/scenarioStorage';
import ScenarioModal from '../../components/ScenarioModal';
import { convertAmount } from '../../utils/frequencyUtils';

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

// EntryForm Component
const EntryForm = ({ category, onSubmit, onClose }) => {
  const [entry, setEntry] = useState({
    name: '',
    value: '',
    frequency: 'monthly'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericValue = parseFloat(entry.value);
    
    // Calculate values based on frequency
    let finalValue = numericValue;
    if (entry.frequency === 'weekly') {
      finalValue = numericValue * 52 / 12;
    } else if (entry.frequency === 'fortnightly') {
      finalValue = numericValue * 26 / 12;
    }

    const valueBreakdown = {
      weekly: entry.frequency === 'weekly' ? numericValue : finalValue * 12 / 52,
      fortnightly: entry.frequency === 'fortnightly' ? numericValue : finalValue * 12 / 26,
      monthly: entry.frequency === 'monthly' ? numericValue : finalValue
    };

    onSubmit({
      id: Date.now(),
      name: entry.name,
      value: finalValue,
      originalValue: numericValue,
      frequency: entry.frequency,
      valueBreakdown
    });
    onClose();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Add {category.charAt(0).toUpperCase() + category.slice(1)} Entry
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={entry.name}
            onChange={(e) => setEntry({ ...entry, name: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            value={entry.value}
            onChange={(e) => setEntry({ ...entry, value: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
            step="0.01"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Frequency</label>
          <select
            value={entry.frequency}
            onChange={(e) => setEntry({ ...entry, frequency: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="weekly">Weekly</option>
            <option value="fortnightly">Fortnightly</option>
            <option value="monthly">Monthly</option>
            <option value="once">One-time</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Entry
          </button>
        </div>
      </form>
    </div>
  );
};
const Dashboard = () => {
  // Add frequency state
  const [selectedFrequency, setSelectedFrequency] = useState('monthly');

  // Load initial state from localStorage
  const loadFromStorage = (key, defaultValue) => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  };

  const [entries, setEntries] = useState(loadFromStorage('entries', {
    income: [],
    savings: [],
    fundamental: [],
    enjoyment: []
  }));

  const [targetPercentages, setTargetPercentages] = useState(loadFromStorage('targetPercentages', {
    savings: 15,
    fundamental: 65,
    enjoyment: 20
  }));

  const [totals, setTotals] = useState({
    income: 0,
    savings: 0,
    fundamental: 0,
    enjoyment: 0
  });

  const [modalState, setModalState] = useState({
    isOpen: false,
    category: null
  });

  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [scenarioModalOpen, setScenarioModalOpen] = useState(false);

  // Format currency consistently
  const formatCurrency = (amount) => {
    const formattedNumber = Math.abs(amount).toFixed(2);
    return `$${formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  // Modal control functions
  const openModal = (category) => {
    setModalState({
      isOpen: true,
      category
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      category: null
    });
  };

  // Entry management functions
  const addEntry = (category, entry) => {
    setEntries(prev => ({
      ...prev,
      [category]: [...prev[category], entry]
    }));
  };

  const deleteEntry = (category, entryId) => {
    setEntries(prev => ({
      ...prev,
      [category]: prev[category].filter(entry => entry.id !== entryId)
    }));
  };

  // Scenario management functions
  const handleSaveScenario = async (name) => {
    const scenarioData = {
      entries,
      targetPercentages
    };
    await scenarioStorage.saveScenario(name, scenarioData);
  };

  const handleLoadScenario = async (id) => {
    const scenario = scenarioStorage.loadScenario(id);
    setEntries(scenario.data.entries);
    setTargetPercentages(scenario.data.targetPercentages);
  };

  const handleDeleteScenario = async (id) => {
    await scenarioStorage.deleteScenario(id);
  };

  // Effects
  useEffect(() => {
    localStorage.setItem('entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('targetPercentages', JSON.stringify(targetPercentages));
  }, [targetPercentages]);

  useEffect(() => {
    const newTotals = {
      income: entries.income.reduce((sum, entry) => sum + entry.value, 0),
      savings: entries.savings.reduce((sum, entry) => sum + entry.value, 0),
      fundamental: entries.fundamental.reduce((sum, entry) => sum + entry.value, 0),
      enjoyment: entries.enjoyment.reduce((sum, entry) => sum + entry.value, 0)
    };
    setTotals(newTotals);
  }, [entries]);

  // Utility functions
  const getPercentage = (category) => {
    if (totals.income === 0) return 0;
    return ((totals[category] / totals.income) * 100).toFixed(1);
  };

  const getVariance = (category) => {
    const actual = parseFloat(getPercentage(category));
    const target = targetPercentages[category];
    return (actual - target).toFixed(1);
  };

  const getTargetAmount = (category) => {
    return (totals.income * (targetPercentages[category] / 100)).toFixed(2);
  };

  const getDollarVariance = (category) => {
    const targetAmount = parseFloat(getTargetAmount(category));
    const actualAmount = totals[category];
    return (actualAmount - targetAmount).toFixed(2);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
  const pieData = [
    { name: 'Savings', value: parseFloat(getPercentage('savings')) },
    { name: 'Fundamental', value: parseFloat(getPercentage('fundamental')) },
    { name: 'Enjoyment', value: parseFloat(getPercentage('enjoyment')) }
  ];

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Our Money</h1>
        <div className="space-x-2">
          <button
            onClick={() => setScenarioModalOpen(true)}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Scenarios
          </button>
          <button
            onClick={() => setSettingsModalOpen(true)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Settings
          </button>
        </div>
      </div>

      {/* Income and Chart Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Section */}
        <div className="bg-white rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold">Income</h2>
              <p className="text-2xl font-bold mt-2">
                {formatCurrency(convertAmount(totals.income, 'monthly', selectedFrequency))}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={selectedFrequency}
                onChange={(e) => setSelectedFrequency(e.target.value)}
                className="border border-gray-300 rounded-md shadow-sm p-2 text-sm"
              >
                <option value="weekly">Weekly</option>
                <option value="fortnightly">Fortnightly</option>
                <option value="monthly">Monthly</option>
              </select>
              <button
                onClick={() => openModal('income')}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
          <TableView
            entries={entries.income}
            onDelete={(id) => deleteEntry('income', id)}
            isIncome={true}
            selectedFrequency={selectedFrequency}
          />
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Spending Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ value }) => `${value}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Savings Category */}
        <CategoryCard
          title="Savings & Investments"
          entries={entries.savings}
          total={totals.savings}
          targetPercentage={targetPercentages.savings}
          targetAmount={parseFloat(getTargetAmount('savings'))}
          onAddEntry={() => openModal('savings')}
          onDeleteEntry={(id) => deleteEntry('savings', id)}
          currentPercentage={parseFloat(getPercentage('savings'))}
          variance={parseFloat(getDollarVariance('savings'))}
          selectedFrequency={selectedFrequency}
        />

        {/* Fundamental Category */}
        <CategoryCard
          title="Fundamental Expenses"
          entries={entries.fundamental}
          total={totals.fundamental}
          targetPercentage={targetPercentages.fundamental}
          targetAmount={parseFloat(getTargetAmount('fundamental'))}
          onAddEntry={() => openModal('fundamental')}
          onDeleteEntry={(id) => deleteEntry('fundamental', id)}
          currentPercentage={parseFloat(getPercentage('fundamental'))}
          variance={parseFloat(getDollarVariance('fundamental'))}
          selectedFrequency={selectedFrequency}
        />

        {/* Enjoyment Category */}
        <CategoryCard
          title="Guilt Free Enjoyment"
          entries={entries.enjoyment}
          total={totals.enjoyment}
          targetPercentage={targetPercentages.enjoyment}
          targetAmount={parseFloat(getTargetAmount('enjoyment'))}
          onAddEntry={() => openModal('enjoyment')}
          onDeleteEntry={(id) => deleteEntry('enjoyment', id)}
          currentPercentage={parseFloat(getPercentage('enjoyment'))}
          variance={parseFloat(getDollarVariance('enjoyment'))}
          selectedFrequency={selectedFrequency}
        />
      </div>

      {/* Modals */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        targetPercentages={targetPercentages}
        onSave={setTargetPercentages}
      />

      <ScenarioModal
        isOpen={scenarioModalOpen}
        onClose={() => setScenarioModalOpen(false)}
        onSave={handleSaveScenario}
        onLoad={handleLoadScenario}
        onDelete={handleDeleteScenario}
      />

      <Modal isOpen={modalState.isOpen} onClose={closeModal}>
        <EntryForm
          category={modalState.category}
          onSubmit={(entry) => addEntry(modalState.category, entry)}
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;