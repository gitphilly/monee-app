// Financial calculations utilities

// Calculate values for different frequencies
export const calculateFrequencyValues = (amount, frequency) => {
    const value = parseFloat(amount);
    if (isNaN(value)) return { weekly: 0, fortnightly: 0, monthly: 0 };
  
    switch (frequency) {
      case 'weekly':
        return {
          weekly: value,
          fortnightly: value * 2,
          monthly: value * 4.33 // Average weeks in a month
        };
      case 'fortnightly':
        return {
          weekly: value / 2,
          fortnightly: value,
          monthly: value * 2.165 // Average fortnights in a month
        };
      case 'monthly':
        return {
          weekly: value / 4.33,
          fortnightly: value / 2.165,
          monthly: value
        };
      case 'once':
      default:
        return {
          weekly: value,
          fortnightly: value,
          monthly: value
        };
    }
  };
  
  // Format currency with NZD symbol and proper decimal places
  export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NZ', {
      style: 'currency',
      currency: 'NZD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  // Calculate percentage of total
  export const calculatePercentage = (amount, total) => {
    if (total === 0) return 0;
    return ((amount / total) * 100).toFixed(1);
  };
  
  // Calculate variance from target
  export const calculateVariance = (actual, target) => {
    return (actual - target).toFixed(1);
  };
  
  // Calculate target amount based on percentage
  export const calculateTargetAmount = (total, percentage) => {
    return (total * (percentage / 100)).toFixed(2);
  };
  
  // Summarize entries by frequency
  export const summarizeByFrequency = (entries) => {
    return entries.reduce((acc, entry) => {
      const freq = entry.frequency || 'once';
      if (!acc[freq]) {
        acc[freq] = {
          count: 0,
          total: 0
        };
      }
      acc[freq].count++;
      acc[freq].total += entry.value;
      return acc;
    }, {});
  };
  
  // Calculate running totals for trend analysis
  export const calculateRunningTotals = (entries) => {
    const sortedEntries = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
    let runningTotal = 0;
    
    return sortedEntries.map(entry => {
      runningTotal += entry.value;
      return {
        ...entry,
        runningTotal
      };
    });
  };