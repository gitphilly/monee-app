import React, { useState } from 'react';
import PropTypes from 'prop-types';

const SettingsModal = ({ isOpen, onClose, targetPercentages, onSave, onReset }) => {
  const [percentages, setPercentages] = useState({ ...targetPercentages });
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

  const handlePercentageChange = (category, value) => {
    const numValue = parseInt(value) || 0;
    setPercentages(prev => ({
      ...prev,
      [category]: numValue
    }));
    setError('');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear all entries? This cannot be undone.')) {
      onReset();
      onClose();
    }
  };

  if (!isOpen) return null;

  const total = Object.values(percentages).reduce((sum, val) => sum + val, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Settings</h3>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-700">Target Percentages</h4>
              
              {/* Savings */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Savings & Investments (%)
                </label>
                <input
                  type="number"
                  value={percentages.savings}
                  onChange={(e) => handlePercentageChange('savings', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  min="0"
                  max="100"
                />
              </div>

              {/* Fundamental */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fundamental Expenses (%)
                </label>
                <input
                  type="number"
                  value={percentages.fundamental}
                  onChange={(e) => handlePercentageChange('fundamental', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  min="0"
                  max="100"
                />
              </div>

              {/* Enjoyment */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Guilt Free Enjoyment (%)
                </label>
                <input
                  type="number"
                  value={percentages.enjoyment}
                  onChange={(e) => handlePercentageChange('enjoyment', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  min="0"
                  max="100"
                />
              </div>

              <div className={`text-sm ${total === 100 ? 'text-green-600' : 'text-red-600'}`}>
                Total: {total}%
              </div>

              {error && (
                <div className="text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Danger Zone</h3>
              <div className="space-y-4">
                <div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
                  >
                    Reset All Data
                  </button>
                  <p className="mt-1 text-sm text-gray-500">
                    This will clear all entries and reset your data to default values.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

SettingsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  targetPercentages: PropTypes.shape({
    savings: PropTypes.number.isRequired,
    fundamental: PropTypes.number.isRequired,
    enjoyment: PropTypes.number.isRequired
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired
};

export default SettingsModal;