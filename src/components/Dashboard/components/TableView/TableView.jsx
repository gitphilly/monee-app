import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FrequencySelector from './FrequencySelector';

const TableView = ({ 
  entries, 
  onDelete, 
  showFrequency = true,
  isIncome = false,
  categoryType = ''
}) => {
  const [selectedFrequency, setSelectedFrequency] = useState('monthly');
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: 'NZD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getValue = (entry) => {
    if (!entry.valueBreakdown || entry.frequency === 'once') {
      return entry.value;
    }
    return entry.valueBreakdown[selectedFrequency];
  };

  return (
    <div className="w-full">
      {showFrequency && (
        <div className="mb-4">
          <FrequencySelector
            value={selectedFrequency}
            onChange={setSelectedFrequency}
          />
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-2 bg-gray-50 border-b border-gray-200">
          <div className="px-4 py-3 text-left text-sm font-medium text-gray-700">
            Description
          </div>
          <div className="px-4 py-3 text-right text-sm font-medium text-gray-700">
            Amount
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {entries.length === 0 ? (
            <div className="px-4 py-3 text-center text-sm text-gray-500">
              No entries yet
            </div>
          ) : (
            entries.map(entry => (
              <div 
                key={entry.id} 
                className="grid grid-cols-2 hover:bg-gray-50"
              >
                <div className="px-4 py-3 flex items-center">
                  <span className="text-gray-900">{entry.name}</span>
                  {entry.frequency !== 'once' && (
                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {entry.frequency}
                    </span>
                  )}
                </div>
                <div className="px-4 py-3 text-right flex items-center justify-end space-x-3">
                  <span className="text-gray-900">
                    {formatCurrency(getValue(entry))}
                  </span>
                  <button
                    onClick={() => onDelete(entry.id)}
                    className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

TableView.propTypes = {
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
  onDelete: PropTypes.func.isRequired,
  showFrequency: PropTypes.bool,
  isIncome: PropTypes.bool,
  categoryType: PropTypes.string
};

export default TableView;