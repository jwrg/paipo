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
      if (month == 11) {
        return {
          text: "SELECT DISTINCT EXTRACT(DAY FROM date) " +
          "AS date_part " +
          "FROM json WHERE " +
          "date >= '" + year + "-12" + "-01' AND " + 
          "date <= '" + (year + 1) + "-01" + "-01'"
        }; 
      } else {
        return {
          text: "SELECT DISTINCT EXTRACT(DAY FROM date) " +
          "AS date_part " +
          "FROM json WHERE " +
          "date >= '" + year + "-" + 
          (
            Math.floor((month + 1)/10) ? 
            (month + 1) : 
            "0" + (month + 1)
          ) + 
          "-01' AND " + "date <= '" + year + "-" + 
          (
            Math.floor((month + 2)/10) ? 
            (month + 2) : 
            "0" + (month + 2)
          ) + 
          "-01'"
        };
      }
    }
  },
  list: {
    date: (year, month, day) => {
      return {
        text: "SELECT users.userid, users.username AS owner, json.id, " +
        "json.date, json.data FROM users JOIN json ON json.userid = users.userid " +
        "WHERE json.date >= '" + year + "-" + 
        (Math.floor(parseInt(month)/10) ? 
          (parseInt(month) + 1) : 
          "0" + (parseInt(month) + 1)) + 
        "-" + (Math.floor(parseInt(day)/10) ? day : "0" + day) +
        "' AND " +
        "json.date < '" + year + "-" + 
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
};
