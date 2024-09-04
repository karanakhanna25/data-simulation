import { IDataGapperUploadExtended } from '@app-simulation/simulation.model';

export function groupByCalendarWeeks(data: IDataGapperUploadExtended[], timeframe: string): { [key: string]: { order: number, value: number } } {
  const groupedData: { [key: string]: { order: number, data: IDataGapperUploadExtended[] } } = {};

  data.forEach(d => {
    const dateObj = new Date(d['Day 1 Date']);

    // Get the start of the week for the current date (Monday)
    const startOfWeek = new Date(dateObj);
    startOfWeek.setDate(dateObj.getDate() - (dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1));

    // Set the end of the week to Friday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 4);  // Monday + 4 days = Friday

    // Format the start and end dates to the desired string format
    const startOfWeekStr = startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const endOfWeekStr = endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const weekKey = `${startOfWeekStr} - ${endOfWeekStr}`;

    // Initialize the group if it doesn't exist yet
    if (!groupedData[weekKey]) {
      groupedData[weekKey] = { order: 0, data: [] };
    }

    // Add the current data point to the corresponding week
    groupedData[weekKey].data.push(d);
  });

  // Sort the keys by their dates and assign order numbers
  let order = 1;
  const sortedGroupedData: { [key: string]: { order: number, value: number } } = {};
  Object.keys(groupedData).sort((a, b) => {
    const dateA = new Date(a.split(' - ')[0]);
    const dateB = new Date(b.split(' - ')[0]);
    return dateA.getTime() - dateB.getTime();
  }).forEach(key => {
    sortedGroupedData[key] = {
      value: findAvgForType(groupedData[key].data, timeframe),
      order: order++
    };
  });

  return sortedGroupedData;
}

export function groupByCalendarMonths(data: IDataGapperUploadExtended[], timeframe: string): { [key: string]: { order: number, value: number } } {
  const groupedData: { [key: string]: { order: number, data: IDataGapperUploadExtended[] } } = {};

  data.forEach(d => {
    const dateObj = new Date(d['Day 1 Date']);

    // Format the date as "Jan 2023", "Feb 2024", etc.
    const monthKey = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    // Initialize the group if it doesn't exist yet
    if (!groupedData[monthKey]) {
      groupedData[monthKey] = { order: 0, data: [] };
    }

    // Add the current data point to the corresponding month
    groupedData[monthKey].data.push(d);
  });

  // Sort the keys by their dates and assign order numbers
  let order = 1;
  const sortedGroupedData: { [key: string]: { order: number, value: number } } = {};
  Object.keys(groupedData).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  }).forEach(key => {
    sortedGroupedData[key] = {
      value: findAvgForType(groupedData[key].data, timeframe),
      order: order++
    };
  });

  return sortedGroupedData;
}

export function groupByDate(data: IDataGapperUploadExtended[], timeframe: string): { [key: string]: { order: number, value: number } } {
  const groupedData: { [key: string]: { order: number, data: IDataGapperUploadExtended[] } } = {};

  data.forEach(d => {
    const dateObj = new Date(d['Day 1 Date']);

    // Format the date as "MM-DD-YYYY"
    const dateKey = formatDate(dateObj);

    // Initialize the group if it doesn't exist yet
    if (!groupedData[dateKey]) {
      groupedData[dateKey] = { order: 0, data: [] };
    }

    // Add the current data point to the corresponding date
    groupedData[dateKey].data.push(d);
  });

  // Sort the keys by their dates and assign order numbers
  let order = 1;
  const sortedGroupedData: { [key: string]: { order: number, value: number } } = {};
  Object.keys(groupedData).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  }).forEach(key => {
    sortedGroupedData[key] = {
      value: findAvgForType(groupedData[key].data, timeframe),
      order: order++
    };
  });

  return sortedGroupedData;
}

// Helper function to format the date as "MM-DD-YYYY"
function formatDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
}


function findAvgForType(data: IDataGapperUploadExtended[], type: string): number {
  switch (type) {
    case 'HOD Spike %':
      return data.reduce((acc, curr) => acc + curr['Open-High Spike%'], 0) / data.length;
    case '10:30am Spike %':
      return data.reduce((acc, curr) => acc + curr['spike % 10:00am'], 0) / data.length;
    case 'Close Spike %':
      return data.reduce((acc, curr) => acc + ((curr['Day 1 Close'] - curr['Day 1 Open'])/curr['Day 1 Open']*100), 0) / data.length;
    case 'high-close Fade %':
      return data.reduce((acc, curr) => acc + ((curr['Day 1 Close'] - curr['Day 1 High'])/curr['Day 1 High']*100), 0) / data.length;
    case 'LOD drop %':
      return data.reduce((acc, curr) => acc + ((curr['Day 1 Low'] - curr['Day 1 Open'])/curr['Day 1 Open']*100), 0) / data.length;
    case '10:30am Low %':
      return data.reduce((acc, curr) => acc + ((curr['Day 1 60Min Low'] - curr['Day 1 Open'])/curr['Day 1 Open']*100), 0) / data.length;
    case 'Open-Close %':
      return data.reduce((acc, curr) => acc + ((curr['Day 1 Close'] - curr['Day 1 Open'])/curr['Day 1 Open']*100), 0) / data.length;
    case 'max spike %':
      return Math.max(...data.map(d => d['Open-High Spike%']));
    case 'max fade %':
      return Math.min(...data.map(d => (d['Day 1 Low'] - d['Day 1 Open'])/d['Day 1 Open']*100));
  default:
    return 0;
  }
}
