import React from 'react';
import PropTypes from 'prop-types';
import FrequencySelector from './FrequencySelector';

const TableView = ({ 
  entries, 
  onDelete, 
  showFrequency = true,
  isIncome = false,
  categoryType = '',
  selectedFrequency = 'monthly'
}) => {
  const formatCurrency = (amount) => {
    const formattedNumber = Math.abs(amount).toFixed(2);
    return `$${formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const getValue = (entry) => {
    if (!entry.valueBreakdown || entry.frequency === 'once') {
      return entry.value;
    }
    return entry.valueBreakdown[selectedFrequency];
  };

  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: 'desc'
  });

  const requestSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: 
        prevConfig.key === key && prevConfig.direction === 'asc' 
          ? 'desc' 
          : 'asc',
    }));
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return '↕️';
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const sortedEntries = React.useMemo(() => {
    let sortableEntries = [...entries];
    if (sortConfig.key !== null) {
      sortableEntries.sort((a, b) => {
        if (sortConfig.key === 'value') {
          return sortConfig.direction === 'asc' 
            ? getValue(a) - getValue(b)
            : getValue(b) - getValue(a);
        }
        if (sortConfig.key === 'name') {
          return sortConfig.direction === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
        return 0;
      });
    }
    return sortableEntries;
  }, [entries, sortConfig, selectedFrequency]);

  return (
    <div className="w-full">
      {/* Table Header */}
      <div className="bg-gray-50 rounded-t-lg">
        <div className="grid grid-cols-2 py-3">
          <button 
            onClick={() => requestSort('name')}
            className="px-4 text-left text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center"
          >
            Description
            <span className="ml-1 text-gray-500">{getSortIcon('name')}</span>
          </button>
          <button 
            onClick={() => requestSort('value')}
            className="px-4 text-right text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center justify-end"
          >
            Amount
            <span className="ml-1 text-gray-500">{getSortIcon('value')}</span>
          </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="bg-white">
        {sortedEntries.length === 0 ? (
          <div className="px-4 py-3 text-center text-sm text-gray-500">
            No entries yet
          </div>
        ) : (
          sortedEntries.map(entry => (
            <div 
              key={entry.id} 
              className="grid grid-cols-2 border-t border-gray-100 hover:bg-gray-50 group"
            >
              <div className="px-4 py-3 text-gray-900">
                {entry.name}
              </div>
              <div className="px-4 py-3 text-right flex items-center justify-end space-x-3">
                <span className="text-gray-900">
                  {formatCurrency(getValue(entry))}
                </span>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            </div>
    ))
  )}
</div>

      {/* Original Value Note */}
      {sortedEntries.some(entry => entry.frequency !== 'once') && (
        <div className="mt-2 text-sm text-gray-500 italic">
          * Values shown are converted to {selectedFrequency} amounts
        </div>
      )}
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
  categoryType: PropTypes.string,
  selectedFrequency: PropTypes.oneOf(['weekly', 'fortnightly', 'monthly'])
};

export default TableView;