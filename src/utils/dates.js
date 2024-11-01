// Format and manipulation utilities for dates
export const getMonthYear = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  };
  
  export const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  };
  
  export const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-NZ', options);
  };
  
  export const getMonthName = (monthYear) => {
    if (!monthYear) return '';
    const [year, month] = monthYear.split('-');
    return new Date(year, parseInt(month) - 1)
      .toLocaleString('default', { month: 'long', year: 'numeric' });
  };
  
  // Get an array of recent months for filtering
  export const getRecentMonths = (count = 12) => {
    const months = [];
    const today = new Date();
    
    for (let i = 0; i < count; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        value: getMonthYear(date),
        label: date.toLocaleString('default', { month: 'long', year: 'numeric' })
      });
    }
    
    return months;
  };
  
  // Get week range for display
  export const getWeekRange = (weekNumber, year = new Date().getFullYear()) => {
    const firstDayOfYear = new Date(year, 0, 1);
    const daysToFirstMonday = (8 - firstDayOfYear.getDay()) % 7;
    const firstMonday = new Date(year, 0, 1 + daysToFirstMonday);
    
    const startDate = new Date(firstMonday);
    startDate.setDate(startDate.getDate() + (weekNumber - 1) * 7);
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    
    return {
      start: startDate.toLocaleDateString('en-NZ', { month: 'short', day: 'numeric' }),
      end: endDate.toLocaleDateString('en-NZ', { month: 'short', day: 'numeric' })
    };
  };