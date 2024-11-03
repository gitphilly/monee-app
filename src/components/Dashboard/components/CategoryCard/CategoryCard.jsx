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
  const isOverBudget = parseFloat(variance) > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      {/* Category Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold capitalize">{title}</h2>
          <p className="text-sm text-gray-500">
            Target: {targetPercentage}% (NZ ${targetAmount.toLocaleString()})
          </p>
        </div>
        <button
          onClick={onAddEntry}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Entry
        </button>
      </div>

      {/* Progress and Stats */}
      <div className="space-y-2">
        {/* Current Amount */}
        <div>
          <p className="text-sm text-gray-500">Current Amount</p>
          <p className="text-xl font-bold">
            NZ ${total.toLocaleString()}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              isOverBudget ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{
              width: `${Math.min(
                (total / targetAmount) * 100,
                100
              )}%`
            }}
          />
        </div>

        {/* Variance */}
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-sm mb-1">Variance</p>
          <p className={`font-bold ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
            NZ ${Math.abs(variance).toLocaleString()}
            <span className="text-sm ml-1">
              ({isOverBudget ? 'over' : 'under'} budget)
            </span>
          </p>
        </div>
      </div>

      {/* Table View */}
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
  entries: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  targetPercentage: PropTypes.number.isRequired,
  targetAmount: PropTypes.number.isRequired,
  onAddEntry: PropTypes.func.isRequired,
  onDeleteEntry: PropTypes.func.isRequired,
  currentPercentage: PropTypes.number.isRequired,
  variance: PropTypes.number.isRequired
};

export default CategoryCard;