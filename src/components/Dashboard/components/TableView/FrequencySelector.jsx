import React from 'react';
import PropTypes from 'prop-types';

const FrequencySelector = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="monthly">Monthly</option>
      <option value="fortnightly">Fortnightly</option>
      <option value="weekly">Weekly</option>
    </select>
  );
};

FrequencySelector.propTypes = {
  value: PropTypes.oneOf(['weekly', 'fortnightly', 'monthly']).isRequired,
  onChange: PropTypes.func.isRequired
};

export default FrequencySelector;