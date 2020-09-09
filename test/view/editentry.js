// Required for tests
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();

// Puppeteer for user-imitation in end-to-end tests
const puppeteer = require('puppeteer');
const pti = require('puppeteer-to-istanbul');

// End to end tests for edit entry view
describe('View: Edit entry', function() {
  let browser;
  let page;

  before(async () => {
    browser = await puppeteer.launch({
      "args": ["--no-sandbox"],
      "headless": false,
      "sloMo": 100
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

  describe('Integration tests', function() {
    it('Returns an editable document when requesting JSON datum with id equal to one', async function() {
      const [ response ] = await Promise.all([
        page.goto('localhost:6891/editentry/1'),
        page.waitForNavigation()
      ]);
      response._status.should.eql(200);
      return page.$x('//h1[contains(., "Edit Entry")]')
        .should.not.eventually.be.eql([]);
    });

    it('Returns a new editable document when requesting JSON datum with null id', async function() {
      const [ response ] = await Promise.all([
        page.goto('localhost:6891/editentry/null'),
        page.waitForNavigation()
      ]);
      response._status.should.eql(200);
      return page.$x('//h1[contains(., "New Entry")]')
        .should.not.eventually.be.eql([]);
    });

    it('Returns a new editable document when requesting JSON datum with a bogus id', async function() {
      const [ response ] = await Promise.all([
        page.goto('localhost:6891/editentry/b0gus1D'),
        page.waitForNavigation()
      ]);
      response._status.should.eql(200);
      return page.$x('//h1[contains(., "New Entry")]')
        .should.not.eventually.be.eql([]);
    });
  });

  describe('Display tests using L2 quadtrees', function() {
    this.retries(4);
    beforeEach(async function() {
      this.timeout(10000);
      let multiClick = async (handle, count, delay = 0) => {
        for (count; count > 0; count--) {
          await handle.click();
          await page.waitFor(delay);
        }
      };
      const [ response ] = await Promise.all([
        page.goto('localhost:6891/editentry/null'),
        page.waitForNavigation()
      ]);
      let tierCount = await page.$$('div.datatier');
      tierCount.length.should.eql(0);
      let addButton = await page.$('input[value="Add a datafield"]');
      await multiClick(addButton, 4, 300);
      tierCount = await page.$$('div.datatier');
      tierCount.length.should.eql(4);
      let expandButton = await page.$$('input[title="Expand this field"]');
      expandButton.length.should.eql(4);
      for (let i = expandButton.length - 1; i >= 0; i--) {
        await expandButton[i].click();
      }
      tierCount = await page.$$('div.datatier');
      tierCount.length.should.eql(8);
      let addSub = await page.$$('input[title="Add a subfield"]');
      addSub.length.should.eql(4);
      for (let i = addSub.length - 1; i >= 0; i--) {
        await multiClick(addSub[i], 3, 300);
      }
      tierCount = await page.$$('div.datatier');
      return tierCount.length.should.eql(20);
    });
    it('Creates a complete quadtree and deletes all children but the last of each parent', async function() {
      for (let i = 3; i > 0; i--) {
        let deleteButton = await page.$$('div#datafields > div.datatier div.datatier:nth-of-type(3) input[title="Delete this field"]');
        for (let k = deleteButton.length - 1; k >= 0; k--) {
          await deleteButton[k].click();
          await page.waitFor(100);
        }
      }
      let tierCount = await page.$$('div.datatier');
      return tierCount.length.should.eql(8);
    }).timeout(20000);
    it('Creates a complete quadtree and repeatedly deletes all second children of each parent', async function() {
      for (let i = 3; i > 0; i--) {
        let deleteButton = await page.$$('div#datafields > div.datatier div.datatier:last-of-type input[title="Delete this field"]');
        for (let k = deleteButton.length - 1; k >= 0; k--) {
          await deleteButton[k].click();
          await page.waitFor(100);
        }
      }
      let tierCount = await page.$$('div.datatier');
      return tierCount.length.should.eql(8);
    });
  });

  describe('End-to-end tests', function() {
    it('From the root, directly access a new editable document', async function() {
      const [ response ] = await Promise.all([
        page.goto('localhost:6891'),
        page.waitForNavigation()
      ]);
      let links = await page.$x('//a[contains(., "New Data Entry")]');
      await Promise.all([
        links[Math.floor(Math.random() * links.length)].click(),
        page.waitForNavigation({waitFor: 'networkIdle2'})
      ]);
      return page.$x('//h1[contains(., "New Entry")]')
        .should.not.eventually.be.eql([]); 
    });
    it('From the calendar, find and access a JSON document');
    it('From the root, directly access an existing document');
    it('Add content to a JSON document and save said document');
  });
}).timeout(20000);
