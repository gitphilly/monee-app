import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../../../utils/dates'; // Updated path

const EntryDisplay = ({ entry, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Format currency with NZD and commas
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: 'NZD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="border border-gray-200 rounded-md">
      {/* Main Entry Row */}
      <div className="p-3 flex items-center justify-between group">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg 
              className={`w-4 h-4 transition-transform ${showDetails ? 'transform rotate-90' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          <div>
            <div className="font-medium">{entry.name}</div>
            <div className="text-sm text-gray-500">{formatDate(entry.date)}</div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {entry.frequency !== 'once' && (
            <span className="text-sm text-blue-500 bg-blue-50 px-2 py-1 rounded">
              {entry.frequency}
            </span>
          )}
          <div className="text-right">
            <div className="font-medium">{formatCurrency(entry.value)}</div>
            {entry.frequency !== 'once' && (
              <div className="text-sm text-gray-500">
                Original: {formatCurrency(entry.originalValue)}
              </div>
            )}
          </div>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this entry?')) {
                onDelete();
              }
            }}
            className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {showDetails && entry.frequency !== 'once' && (
        <div className="border-t border-gray-200 bg-gray-50 p-3">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-500">Weekly</div>
              <div className="font-medium">
                {formatCurrency(entry.valueBreakdown.weekly)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Fortnightly</div>
              <div className="font-medium">
                {formatCurrency(entry.valueBreakdown.fortnightly)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Monthly</div>
              <div className="font-medium">
                {formatCurrency(entry.valueBreakdown.monthly)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Prop Types for better development experience
EntryDisplay.propTypes = {
    entry: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      originalValue: PropTypes.number,
      date: PropTypes.string.isRequired,
      frequency: PropTypes.oneOf(['once', 'weekly', 'fortnightly', 'monthly']).isRequired,
      valueBreakdown: PropTypes.shape({
        weekly: PropTypes.number,
        fortnightly: PropTypes.number,
        monthly: PropTypes.number
      })
    }).isRequired,
    onDelete: PropTypes.func.isRequired
};

export default EntryDisplay;