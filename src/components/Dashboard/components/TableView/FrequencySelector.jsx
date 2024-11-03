import React from 'react';
import PropTypes from 'prop-types';

const FrequencySelector = ({ value, onChange }) => {
  const frequencies = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'fortnightly', label: 'Fortnightly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm text-gray-600">View as:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-select rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {frequencies.map(freq => (
          <option key={freq.value} value={freq.value}>
            {freq.label}
          </option>
        ))}
      </select>
    </div>
  );
};

FrequencySelector.propTypes = {
  value: PropTypes.oneOf(['weekly', 'fortnightly', 'monthly']).isRequired,
  onChange: PropTypes.func.isRequired
};

export default FrequencySelector;