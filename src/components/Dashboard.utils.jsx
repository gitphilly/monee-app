import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

// Utility functions for date handling
const getMonthYear = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const getWeekNumber = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {children}
      </div>
    </div>
  );
};

// Settings Modal Component
const SettingsModal = ({ isOpen, onClose, targetPercentages, onSave }) => {
  const [percentages, setPercentages] = useState(targetPercentages);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const total = Object.values(percentages).reduce((sum, val) => sum + val, 0);
    
    if (total !== 100) {
      setError('Percentages must add up to 100%');
      return;
    }

    onSave(percentages);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold mb-4">Adjust Target Percentages</h2>
        
        {Object.entries(percentages).map(([category, value]) => (
          <div key={category}>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {category} (%)
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setPercentages({
                ...percentages,
                [category]: parseFloat(e.target.value) || 0
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              step="0.1"
              min="0"
              max="100"
            />
          </div>
        ))}

        {error && <p className="text-red-500">{error}</p>}
        
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
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Entry Form Component
const EntryForm = ({ category, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Description is required');
      return;
    }
    
    const value = parseFloat(formData.value);
    if (isNaN(value) || value <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    onSubmit({
      id: Date.now(),
      name: formData.name.trim(),
      value: value,
      date: formData.date,
      monthYear: getMonthYear(formData.date),
      weekNumber: getWeekNumber(formData.date)
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-4 capitalize">
          Add {category} Entry
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (NZD)
            </label>
            <input
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter amount"
              step="0.01"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
      
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
      
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
  );
};

// Progress Bar Component
const ProgressBar = ({ actual, target }) => {
  const percentage = Math.min((actual / target) * 100, 100);
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className={`h-2.5 rounded-full ${percentage > 100 ? 'bg-red-500' : 'bg-blue-500'}`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      ></div>
    </div>
  );
};

export { Modal, SettingsModal, EntryForm, ProgressBar, getMonthYear, getWeekNumber };