const queries = module.exports = {
  /**
   * Dashboard view queries
   */
  dashboard: {
    count: {
      text: 'SELECT COUNT(*) FROM json'
    },
    upcoming: {
      text: 'SELECT * FROM json WHERE date > now() ORDER BY date ASC LIMIT 5'
    },
    past: {
      text: 'SELECT * FROM json WHERE date < now() ORDER BY date DESC LIMIT 5'
    }
  },
  calendar: {
    dates : (year, month) => {
      return {
        text: "SELECT DISTINCT EXTRACT(DAY FROM date) FROM json WHERE " +
          "date >= '" + year + "-" + (Math.floor(parseInt(month)/10) ? (parseInt(month) + 1) : "0" + (parseInt(month) + 1)) + "-01' AND " +
          "date <= '" + year + "-" + (Math.floor(parseInt(month)/10) ? (parseInt(month) + 2) : "0" + (parseInt(month) + 2)) + "-01'"
      };
    }
  }
}
