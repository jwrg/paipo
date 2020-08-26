// Required for tests
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();

// Puppeteer for user-imitation in end-to-end tests
const puppeteer = require('puppeteer');

// End to end tests for dashboard view
describe('View: Dashboard', function() {
  let browser;
  let page;

  before(async () => {
    browser = await puppeteer.launch({
      "args": ["--no-sandbox"],
      "headless": false,
    });
  });
  beforeEach(async () => {
    page = await browser.newPage();
    // Enable CSS and JS coverage
    await Promise.all([
      page.coverage.startJSCoverage(),
      page.coverage.startCSSCoverage(),
    ]);
  });
  afterEach(async () => {
    // Get coverage data
    const [ jsCoverage, cssCoverage ] = await Promise.all([
      page.coverage.stopJSCoverage(),
      page.coverage.stopCSSCoverage(),
    ]);
    // Give promises time to resolve before starting
    // the next test
    await page.waitFor(1500);
    await page.close();
  });
  after(async () => {
    await browser.close();
  });

  it('Returns 200 when requesting app root', async function() {
    const [ response ] = await Promise.all([
      page.goto('localhost:6891'),
      page.waitForNavigation()
    ]);
    response._status.should.eql(200);
  }).timeout(20000);
}).timeout(20000);
