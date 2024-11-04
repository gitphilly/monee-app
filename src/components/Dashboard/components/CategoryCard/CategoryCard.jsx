import React from 'react';
import PropTypes from 'prop-types';
import TableView from '../TableView';

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
  // Helper function for currency formatting
  const formatCurrency = (amount) => {
    const formattedNumber = Math.abs(amount).toFixed(2);
    return `$${formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  // Helper to get variance display text
  const getVarianceText = () => {
    const absVariance = Math.abs(variance);
    const status = variance > 0 ? 'over' : 'under';
    return `${formatCurrency(absVariance)} (${status} budget)`;
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-gray-600">
            Target: {targetPercentage}% ({formatCurrency(targetAmount)})
          </p>
        </div>
        <button
          onClick={onAddEntry}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Entry
        </button>
      </div>

      {/* Current Amount */}
      <div className="mb-4">
        <p className="text-gray-600">Current Amount</p>
        <p className="text-2xl font-bold">{formatCurrency(total)}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className={`h-2 rounded-full transition-all ${
            variance > 0 ? 'bg-red-500' : 'bg-blue-500'
          }`}
          style={{
            width: `${Math.min((total / targetAmount) * 100, 100)}%`
          }}
        />
      </div>

      {/* Variance */}
      <div className="bg-gray-50 p-3 rounded mb-4">
        <p className="text-sm mb-1">Variance</p>
        <p className={`${variance > 0 ? 'text-red-500' : 'text-green-500'}`}>
          {getVarianceText()}
        </p>
      </div>

      {/* Entries Table */}
      <TableView
        entries={entries}
        onDelete={onDeleteEntry}
        categoryType={title.toLowerCase()}
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