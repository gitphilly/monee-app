import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import ScenarioModal from './ScenarioModal';
import { Modal, EntryForm, ProgressBar } from './Dashboard.utils';
import EntryDisplay from './components/EntryDisplay';
import SettingsModal from './components/SettingsModal';
import { scenarioStorage } from '../../services/scenarioStorage';

const Dashboard = () => {
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
  const [sortConfig, setSortConfig] = useState({
    category: null,
    field: 'value',
    direction: 'desc'
  });

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
  const sortEntries = (category, entriesToSort) => {
    if (!sortConfig.field) return entriesToSort;

    return [...entriesToSort].sort((a, b) => {
      if (sortConfig.field === 'value') {
        return sortConfig.direction === 'asc' 
          ? a.value - b.value
          : b.value - a.value;
      }
      if (sortConfig.field === 'name') {
        return sortConfig.direction === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });
  };

  const handleSort = (category, field) => {
    setSortConfig(prev => ({
      category,
      field,
      direction: 
        prev.category === category && prev.field === field
          ? prev.direction === 'asc' 
            ? 'desc' 
            : 'asc'
          : 'asc'
    }));
  };

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
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">MonEee Dashboard</h1>
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Income Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Income</h2>
          <div className="space-y-4">
            <p className="text-2xl font-bold">NZ ${totals.income.toLocaleString()}</p>
            <button 
              onClick={() => openModal('income')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Income
            </button>
            {entries.income.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Income Entries:</h3>
                <div className="space-y-2">
                  {sortEntries('income', entries.income).map(entry => (
                    <EntryDisplay
                      key={entry.id}
                      entry={entry}
                      onDelete={() => deleteEntry('income', entry.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
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
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['savings', 'fundamental', 'enjoyment'].map((category) => (
          <div key={category} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 capitalize">{category}</h2>
            <div className="space-y-4">
              {/* Current Amount */}
              <div>
                <p className="text-sm text-gray-500">Current Amount</p>
                <p className="text-xl font-bold">NZ ${totals[category].toLocaleString()}</p>
              </div>

              {/* Target Amount */}
              <div>
                <p className="text-sm text-gray-500">Target Amount ({targetPercentages[category]}%)</p>
                <p className="text-xl">NZ ${parseFloat(getTargetAmount(category)).toLocaleString()}</p>
              </div>

              {/* Progress Bar */}
              <ProgressBar 
                actual={totals[category]} 
                target={parseFloat(getTargetAmount(category))}
              />

              {/* Variance */}
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm mb-1">Variance</p>
                <p className={`font-bold ${parseFloat(getDollarVariance(category)) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  NZ ${parseFloat(getDollarVariance(category)).toLocaleString()}
                  <span className="text-sm ml-1">({getVariance(category)}%)</span>
                </p>
              </div>

              <button 
                onClick={() => openModal(category)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
              >
                Add Entry
              </button>

              {/* Category Entries */}
              {entries[category].length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Entries:</h3>
                  <div className="space-y-2">
                    {sortEntries(category, entries[category]).map(entry => (
                      <EntryDisplay
                        key={entry.id}
                        entry={entry}
                        onDelete={() => deleteEntry(category, entry.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
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