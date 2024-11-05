import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../../utils/dashboardUtils';

const SettingsModal = ({ isOpen, onClose, targetPercentages, onSave }) => {
  const [percentages, setPercentages] = useState(targetPercentages);
  const [error, setError] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setPercentages(targetPercentages);
      setError('');
      setIsDirty(false);
    }
  }, [isOpen, targetPercentages]);

  const handleChange = (category, value) => {
    const numberValue = parseFloat(value) || 0;
    setPercentages(prev => ({
      ...prev,
      [category]: numberValue
    }));
    setIsDirty(true);
    setError('');
  };

  const calculateTotal = () => {
    return Object.values(percentages).reduce((sum, val) => sum + val, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const total = calculateTotal();
    
    if (total !== 100) {
      setError(`Total must equal 100%. Current total: ${total}%`);
      return;
    }

    onSave(percentages);
    onClose();
  };

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Budget Settings</h2>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Set your target percentages for each category. The total must equal 100%.
            </p>

            {/* Percentage Inputs */}
            {Object.entries(percentages).map(([category, value]) => (
              <div key={category}>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {category}
                  </label>
                  <span className="text-sm text-gray-500">
                    Target: {value}%
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => handleChange(category, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                  <span className="text-gray-500">%</span>
                </div>
              </div>
            ))}

            {/* Total Display */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="font-medium">Total</span>
              <span className={`font-bold ${calculateTotal() === 100 ? 'text-green-500' : 'text-red-500'}`}>
                {calculateTotal()}%
              </span>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              disabled={!isDirty || calculateTotal() !== 100}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </Modal>
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
  onSave: PropTypes.func.isRequired
};

export default SettingsModal;