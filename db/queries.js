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
  },
  list: {
    date: (year, month, day) => {
      return {
        text: "SELECT * FROM json WHERE " + 
          "date >= '" + year + "-" + 
          (Math.floor(parseInt(month)/10) ? 
            (parseInt(month) + 1) : 
            "0" + (parseInt(month) + 1)) + 
          "-" + (Math.floor(parseInt(day)/10) ? day : "0" + day) +
          "' AND " +
          "date < '" + year + "-" + 
          (Math.floor(parseInt(month)/10) ? 
            (parseInt(month) + 1) : 
            "0" + (parseInt(month) + 1)) +
          "-" + (Math.floor(parseInt(day + 1)/10) ? 
            parseInt(day) + 1 : 
            "0" + (parseInt(day) + 1)) + "'"
      };
    }
  },
  edit: {
    byId: (id) => {
      return {
        text: "SELECT * FROM json WHERE " +
        "id = " + id 
      };
    }
  }
}
