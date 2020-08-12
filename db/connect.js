const { Client, Pool } = require('pg');
const cfg = require('../cfg/db.json');

const db = module.exports = {
  /**
   * Database client pool
   */
  pool: new Pool(cfg),
};
