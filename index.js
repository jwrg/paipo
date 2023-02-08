const Koa = require('koa');
const Router = require('koa-tree-router');
const render = require('@koa/ejs');
const serve = require('koa-static');
const mount = require('koa-mount');
const parse = require('koa-bodyparser');
const path = require('path');
const fs = require('fs');

const app = new Koa();
const router = new Router();

const view = require('./lib/view.js');


/**
 * Configure default layout for views
 */
render(app, {
  root: path.join(__dirname,'ejs'),
  layout: 'layout/regular',
  viewExt: 'ejs',
  cache: false,
  debug: false
});

/**
 * Register routes with middleware from lib/view.js
 */

/**
 * Routes for visualizing data
 */
router.get('/', view.dashboard);
router.get('/elements', view.elements);
router.get('/calendar/:year/:month', view.calendar);
router.get('/list/date/:year/:month/:day', view.list.date);
router.get('/list/range/:start/:end', view.list.range);

/**
 * Routes for editing data
 */
router.get('/newentry/:year/:month/:day', view.newEntry);
router.get('/editentry/:id', view.editEntry);
router.post('/saveentry', view.saveEntry);

/**
 * Define top-level middleware
 *
 * Any middleware that does not deserve its own module
 * can go below here; anything that does can go in lib/
 * or db/
 */
async function initNamespace(ctx, next) {
  ctx.state = ctx.state || {};
  ctx.state.now = new Date();
  ctx.state.user = 1;
  ctx.state.userName = 'Fake User';
  return next();
}

/******************
 *
 * Middleware Stack
 *
 * All your app.use() bits can go below here
 *
 */

/**
 * Configure app internal namespace
 *
 * Put all variables you wish to access from templates
 * inside this namespace
 */
app.use(initNamespace);

/**
 * Mount static content
 */
app.use(mount('/css', serve('./css')));
app.use(mount('/js', serve('./script')));

/**
 * Parse any request body
 */
app.use(parse());

/**
 * Apply router
 */
app.use(router.routes());

/**
 * And finally, listen for the request, at which time
 * the logical flow proceeds back up the chain, resolving
 * each middleware stack item by resuming its execution 
 * flow from next()
 */

app.listen(6891);
