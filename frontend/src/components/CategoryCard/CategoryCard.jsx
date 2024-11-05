import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TableView from '../TableView';
import { convertAmount } from '../../utils/frequencyUtils';

const CategoryCard = ({ 
  title,
  entries,
  total,
  targetPercentage,
  targetAmount,
  onAddEntry,
  onDeleteEntry,
  currentPercentage,
  variance
}) => {
  const [selectedFrequency, setSelectedFrequency] = useState('monthly');

  // Helper function for currency formatting
  const formatCurrency = (amount) => {
    const formattedNumber = Math.abs(amount).toFixed(2);
    return `$${formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  // Convert amounts based on selected frequency
  const displayTotal = convertAmount(total, 'monthly', selectedFrequency);
  const displayTargetAmount = convertAmount(targetAmount, 'monthly', selectedFrequency);
  const displayVariance = convertAmount(variance, 'monthly', selectedFrequency);

  // Helper to get variance display text
  const getVarianceText = () => {
    const absVariance = Math.abs(displayVariance);
    const status = displayVariance > 0 ? 'over' : 'under';
    return `${formatCurrency(absVariance)} (${status} budget)`;
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-gray-600">
            Target: {targetPercentage}% ({formatCurrency(displayTargetAmount)})
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
            onClick={onAddEntry}
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

      {/* Current Amount */}
      <div className="mb-4">
        <p className="text-gray-600">Current Amount</p>
        <p className="text-2xl font-bold">{formatCurrency(displayTotal)}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className={`h-2 rounded-full transition-all ${
            displayVariance > 0 ? 'bg-red-500' : 'bg-blue-500'
          }`}
          style={{
            width: `${Math.min((displayTotal / displayTargetAmount) * 100, 100)}%`
          }}
        />
      </div>

      {/* Variance */}
      <div className="bg-gray-50 p-3 rounded mb-4">
        <p className="text-sm mb-1">Variance</p>
        <p className={`${displayVariance > 0 ? 'text-red-500' : 'text-green-500'}`}>
          {getVarianceText()}
        </p>
      </div>

      {/* Entries Table */}
      <TableView
        entries={entries}
        onDelete={onDeleteEntry}
        categoryType={title.toLowerCase()}
        selectedFrequency={selectedFrequency}
      />
    </div>
  );
};

CategoryCard.propTypes = {
  title: PropTypes.string.isRequired,
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      frequency: PropTypes.oneOf(['once', 'weekly', 'fortnightly', 'monthly']).isRequired,
      valueBreakdown: PropTypes.shape({
        weekly: PropTypes.number,
        fortnightly: PropTypes.number,
        monthly: PropTypes.number
      })
    })
  ).isRequired,
  total: PropTypes.number.isRequired,
  targetPercentage: PropTypes.number.isRequired,
  targetAmount: PropTypes.number.isRequired,
  onAddEntry: PropTypes.func.isRequired,
  onDeleteEntry: PropTypes.func.isRequired,
  currentPercentage: PropTypes.number.isRequired,
  variance: PropTypes.number.isRequired
};

export default CategoryCard;