const handler = require('../lib/handler.js');
const queries = require('../db/queries.js');
const db = require('../db/connect.js');

const view = module.exports = {
  /**
   * Dashboard view
   */
  dashboard: async (ctx, next) => {
    await ctx.render('dashboard', {
      count: await (await db.pool.query(queries.dashboard.count)).rows[0].count,
      data: { 
        upcoming: await (await db.pool.query(queries.dashboard.upcoming)).rows,
        past: await (await db.pool.query(queries.dashboard.past)).rows
      }
    });
  },
  /**
   * Elements (style test) view
   */
  elements: async (ctx, next) => {
    await ctx.render('elements');
  },
  /**
   * Calendar view
   */
  calendar: async (ctx, next) => {
    if ((parseInt(ctx.params.year) > 0) && 
      (parseInt(ctx.params.month) >= 0) && 
      (parseInt(ctx.params.month) <= 11)) {
      await ctx.render('month', {
        month: parseInt(ctx.params.month),
        year: parseInt(ctx.params.year),
        data: await (await db.pool.query(queries.calendar.dates(parseInt(ctx.params.year), parseInt(ctx.params.month)))).rows
      });
    } else {
      ctx.throw(500, 'Date out of range: ' + ctx.params.month + '/' + ctx.params.year);
    }
  },
  /**
   * List views
   *
   * List entries based on some criterium/-a, namely:
   *
   * A date (day, month, year)
   * A range (starting id, ending id [not inclusive, obv.])
   */
  list: {
    date: async (ctx, next) => {
      await ctx.render('listdate', {
        day: ctx.params.day,
        month: ctx.params.month,
        year: ctx.params.year,
        data: await (await db.pool.query(queries.list.date(ctx.params.year, ctx.params.month, ctx.params.day))).rows
      });
    },
    range: async (ctx, next) => {
      await ctx.render('listrange', {
        start: ctx.params.start,
        end: ctx.params.end
      });
    }
  },  
  /**
   * Edit data entry view
   *
   * This doubles as an entry details view and best
   * practices would suggest an alert window on save
   */
  editEntry: async (ctx, next) => {
    if (isNaN(parseInt(ctx.params.id))) {
      await ctx.render('editentry', {
        id: null,
        entry: {
          id: null,
          date: new Date(),
          data: [],
        },
      });
    } else {
      await ctx.render('editentry', {
        id: ctx.params.id,
        entry: await (await db.pool.query(queries.edit.byId(ctx.params.id))).rows[0]
      });
    }
  },
  /**
   * New data entry view
   *
   * This could potentially use a default case where
   * if no full date is specified, it defaults to
   * the current date
   */
  newEntry: async (ctx, next) => {
    await ctx.render('newentry', {
      day: ctx.params.day,
      month: ctx.params.month,
      year: ctx.params.year,
    });
  },
  /**
   * Save release view
   *
   * Not so much a view per se but it is helpful to
   * hand the parsed request off to a handler and then
   * redirect to one of the above views
   */
  // POST SaveRelease handler
  // The meat and potatoes of the app
  saveEntry: async (ctx, next) => {
    handler.saveEntry(ctx.request.body);
    // Navigate back to the date query view
    await ctx.render('listdate', {
      day: ctx.request.body.date.substring(8,10),
      month: ctx.request.body.date.substring(5,7) - 1,
      year: ctx.request.body.date.substring(0,4)
    });
  }
};
