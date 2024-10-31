import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Dashboard = () => {
  const [entries, setEntries] = useState({
    income: [],
    savings: [],
    fundamental: [],
    enjoyment: []
  });

  const [totals, setTotals] = useState({
    income: 0,
    savings: 0,
    fundamental: 0,
    enjoyment: 0
  });

  const targetPercentages = {
    savings: 15,
    fundamental: 65,
    enjoyment: 20
  };

  // Calculate totals and percentages
  useEffect(() => {
    const newTotals = {
      income: entries.income.reduce((sum, entry) => sum + entry.value, 0),
      savings: entries.savings.reduce((sum, entry) => sum + entry.value, 0),
      fundamental: entries.fundamental.reduce((sum, entry) => sum + entry.value, 0),
      enjoyment: entries.enjoyment.reduce((sum, entry) => sum + entry.value, 0)
    };
    setTotals(newTotals);
  }, [entries]);

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

  const getPercentage = (category) => {
    if (totals.income === 0) return 0;
    return ((totals[category] / totals.income) * 100).toFixed(1);
  };

  const getVariance = (category) => {
    const actual = parseFloat(getPercentage(category));
    const target = targetPercentages[category];
    return (actual - target).toFixed(1);
  };

  const pieData = [
    { name: 'Savings', value: parseFloat(getPercentage('savings')) },
    { name: 'Fundamental', value: parseFloat(getPercentage('fundamental')) },
    { name: 'Enjoyment', value: parseFloat(getPercentage('enjoyment')) }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">MonEee Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Income Tracker</h2>
          <div className="space-y-2">
            <p className="text-2xl font-bold">NZ ${totals.income.toLocaleString()}</p>
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => {
                const value = parseFloat(prompt('Enter income amount:'));
                const name = prompt('Enter income description:');
                if (!isNaN(value) && name) {
                  addEntry('income', { id: Date.now(), name, value });
                }
              }}
            >
              Add Income
            </button>
          </div>
        </div>

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['savings', 'fundamental', 'enjoyment'].map((category) => (
          <div key={category} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 capitalize">{category}</h2>
            <div className="space-y-2">
              <p className="text-xl font-bold">NZ ${totals[category].toLocaleString()}</p>
              <p>Current: {getPercentage(category)}%</p>
              <p>Target: {targetPercentages[category]}%</p>
              <p className={`font-bold ${parseFloat(getVariance(category)) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                Variance: {getVariance(category)}%
              </p>
              <button 
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={() => {
                  const value = parseFloat(prompt('Enter amount:'));
                  const name = prompt('Enter description:');
                  if (!isNaN(value) && name) {
                    addEntry(category, { id: Date.now(), name, value });
                  }
                }}
              >
                Add Entry
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;