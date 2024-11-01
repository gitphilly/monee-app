import React, { useState } from 'react';
import { getMonthYear, getWeekNumber } from '../../utils/dates';
import { calculateFrequencyValues } from '../../utils/calculations';

// Basic Modal Component
export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {children}
      </div>
    </div>
  );
};

// Progress Bar Component
export const ProgressBar = ({ actual, target }) => {
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

// Entry Form Component
export const EntryForm = ({ category, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    date: new Date().toISOString().split('T')[0],
    frequency: 'once',
    originalValue: ''
  });
  
  const [error, setError] = useState('');

  const frequencyOptions = [
    { value: 'once', label: 'One-time' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'fortnightly', label: 'Fortnightly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const handleValueChange = (e) => {
    const newValue = e.target.value;
    const values = calculateFrequencyValues(newValue, formData.frequency);
    
    setFormData(prev => ({
      ...prev,
      value: values.monthly,
      originalValue: newValue
    }));
  };

  const handleFrequencyChange = (e) => {
    const newFrequency = e.target.value;
    const values = calculateFrequencyValues(formData.originalValue, newFrequency);
    
    setFormData(prev => ({
      ...prev,
      frequency: newFrequency,
      value: values.monthly
    }));
  };

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

    const values = calculateFrequencyValues(formData.originalValue, formData.frequency);

    onSubmit({
      id: Date.now(),
      name: formData.name.trim(),
      value: values.monthly,
      originalValue: parseFloat(formData.originalValue),
      frequency: formData.frequency,
      date: formData.date,
      monthYear: getMonthYear(formData.date),
      weekNumber: getWeekNumber(formData.date),
      valueBreakdown: {
        weekly: values.weekly,
        fortnightly: values.fortnightly,
        monthly: values.monthly
      }
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (NZD)
              </label>
              <input
                type="number"
                value={formData.originalValue}
                onChange={handleValueChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter amount"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={handleFrequencyChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {frequencyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {formData.originalValue && formData.frequency !== 'once' && (
            <div className="bg-gray-50 p-3 rounded">
              <h3 className="font-medium mb-2">Calculated Values:</h3>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Weekly</p>
                  <p className="font-medium">
                    NZ ${calculateFrequencyValues(formData.originalValue, formData.frequency).weekly.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Fortnightly</p>
                  <p className="font-medium">
                    NZ ${calculateFrequencyValues(formData.originalValue, formData.frequency).fortnightly.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Monthly</p>
                  <p className="font-medium">
                    NZ ${calculateFrequencyValues(formData.originalValue, formData.frequency).monthly.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

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