// src/utils/frequencyUtils.js

// Convert amount between different frequencies
export const convertAmount = (amount, fromFrequency, toFrequency) => {
    // If frequencies are the same, return original amount
    if (fromFrequency === toFrequency) return amount;
    
    // First convert to monthly
    const monthlyAmount = toMonthly(amount, fromFrequency);
    // Then convert from monthly to target frequency
    return fromMonthly(monthlyAmount, toFrequency);
  };
  
  // Convert any frequency to monthly
  const toMonthly = (amount, fromFrequency) => {
    switch (fromFrequency) {
      case 'weekly':
        return amount * 52 / 12;
      case 'fortnightly':
        return amount * 26 / 12;
      default: // monthly
        return amount;
    }
  };
  
  // Convert monthly to any frequency
  const fromMonthly = (monthlyAmount, toFrequency) => {
    switch (toFrequency) {
      case 'weekly':
        return monthlyAmount * 12 / 52;
      case 'fortnightly':
        return monthlyAmount * 12 / 26;
      default: // monthly
        return monthlyAmount;
    }
  };
  
  // Create valueBreakdown for an entry
  export const createValueBreakdown = (value, frequency) => {
    const monthlyValue = toMonthly(value, frequency);
    
    return {
      weekly: fromMonthly(monthlyValue, 'weekly'),
      fortnightly: fromMonthly(monthlyValue, 'fortnightly'),
      monthly: monthlyValue
    };
  };