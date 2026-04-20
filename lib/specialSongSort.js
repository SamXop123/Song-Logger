const MONTH_ORDER = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

function parseYear(value) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function getMonthOrder(month) {
  if (!month) return 0;
  return MONTH_ORDER[month] || 0;
}

function compareByDateAddedDesc(a, b) {
  return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
}

export function sortYearSpecialSongs(songs) {
  return [...songs].sort((a, b) => {
    const yearDifference = parseYear(b.year) - parseYear(a.year);
    if (yearDifference !== 0) return yearDifference;
    return compareByDateAddedDesc(a, b);
  });
}

export function sortMonthSpecialSongs(songs) {
  return [...songs].sort((a, b) => {
    const yearDifference = parseYear(b.year) - parseYear(a.year);
    if (yearDifference !== 0) return yearDifference;

    const monthDifference = getMonthOrder(b.month) - getMonthOrder(a.month);
    if (monthDifference !== 0) return monthDifference;

    return compareByDateAddedDesc(a, b);
  });
}
