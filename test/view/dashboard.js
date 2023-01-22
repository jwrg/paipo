// Required for tests
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();

// Puppeteer for user-imitation in end-to-end tests
const puppeteer = require('puppeteer');
const pti = require('puppeteer-to-istanbul');

// End to end tests for dashboard view
describe('View: Dashboard', function() {
  let browser;
  let page;
  let host = 'localhost:6891';

  before(async () => {
    browser = await puppeteer.launch({
      "args": ["--no-sandbox"],
      "headless": true,
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
    pti.write([...jsCoverage, ...cssCoverage], { includeHostname: true , storagePath: './.nyc_output' });
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
      page.goto(host),
      page.waitForNavigation()
    ]);
    response._status.should.eql(200);
  }).timeout(20000);
  it('From the root, directly access an existing document', async function () {
    const [ response ] = await Promise.all([
      page.goto(host),
      page.waitForNavigation()
    ]);
    let links = await page.$$('td a');
    await Promise.all([
      links[Math.floor(Math.random() * links.length)].click(),
      page.waitForNavigation({waitFor: 'networkIdle2'})
    ]);
    return page.$x('//h1[contains(., "Edit Entry")]')
      .should.not.eventually.be.eql([]); 
  });
}).timeout(20000);
