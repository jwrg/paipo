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
  }
}
