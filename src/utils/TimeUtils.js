export function getWeekNumber(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const day = startOfYear.getDay();

  const daysOffset = day === 0 ? 6 : day - 1;
  const pastDaysOfYear = Math.floor(
    (date - startOfYear + daysOffset * 24 * 60 * 60 * 1000) /
      (24 * 60 * 60 * 1000)
  );

  return Math.ceil(pastDaysOfYear / 7);
}
