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
  let status;
  let today = new Date();
  let month = today.getMonth();
  let year = today.getFullYear();
  let host = 'localhost:6891';
  let resource = 'editentry';

  before(async () => {
    browser = await puppeteer.launch({
      "args": ["--no-sandbox"],
      "headless": true,
      "sloMo": 100
    });
  });
  beforeEach(async () => {
    page = await browser.newPage();
    // Response status interception
    await page.setRequestInterception(true);
    page.on('request', (request) => { request.continue(); });
    page.on('response', (response) => { status = response.status(); });
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
    await page.waitForTimeout(1000);
    await page.close();
  });
  after(async () => {
    await browser.close();
  });

  describe('Integration tests', function() {
    it('Returns an editable document when requesting JSON datum with id equal to one', async function() {
      await Promise.all([
        page.goto([host, resource, 1].join('/')),
        page.waitForNavigation()
      ]);
      status.should.eql(200);
      return page.$x('//h1[contains(., "Edit Entry")]')
        .should.not.eventually.be.eql([]);
    });

    it('Returns a new editable document when requesting JSON datum with null id', async function() {
      await Promise.all([
        page.goto([host, resource, 'null'].join('/')),
        page.waitForNavigation()
      ]);
      status.should.eql(200);
      return page.$x('//h1[contains(., "New Entry")]')
        .should.not.eventually.be.eql([]);
    });

    it('Returns a new editable document when requesting JSON datum with a bogus id', async function() {
      await Promise.all([
        page.goto([host, resource, 'b0gus1D'].join('/')),
        page.waitForNavigation()
      ]);
      status.should.eql(200);
      return page.$x('//h1[contains(., "New Entry")]')
        .should.not.eventually.be.eql([]);
    });
  });

  describe('Display tests using L2 quadtrees', function() {
    this.retries(2);
    beforeEach(async function() {
      this.timeout(10000);
      let multiClick = async (handle, count, delay = 0) => {
        for (count; count > 0; count--) {
          await handle.click();
          await page.waitForTimeout(delay);
        }
      };
      const [ response ] = await Promise.all([
        page.goto([host, resource, 'null'].join('/')),
        page.waitForNavigation()
      ]);
      let tierCount = await page.$$('div.datatier');
      tierCount.length.should.eql(0);
      let addButton = await page.$('input[value="Add a datafield"]');
      await multiClick(addButton, 4, 100);
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
        await multiClick(addSub[i], 3, 100);
      }
      tierCount = await page.$$('div.datatier');
      return tierCount.length.should.eql(20);
    });
    it('Takes a complete L2 quadtree and deletes all children but the last of each parent', async function() {
      for (let i = 3; i > 0; i--) {
        let deleteButton = await page.$$('div#datafields > div.datatier div.datatier:nth-of-type(3) input[title="Delete this field"]');
        for (let k = deleteButton.length - 1; k >= 0; k--) {
          await deleteButton[k].click();
          await page.waitForTimeout(100);
        }
      }
      let tierCount = await page.$$('div.datatier');
      return tierCount.length.should.eql(8);
    }).timeout(20000);
    it('Takes a complete L2 quadtree and repeatedly deletes all second children of each parent', async function() {
      for (let i = 3; i > 0; i--) {
        let deleteButton = await page.$$('div#datafields > div.datatier div.datatier:last-of-type input[title="Delete this field"]');
        for (let k = deleteButton.length - 1; k >= 0; k--) {
          await deleteButton[k].click();
          await page.waitForTimeout(100);
        }
      }
      let tierCount = await page.$$('div.datatier');
      return tierCount.length.should.eql(8);
    }).timeout(20000);
    it('Takes a complete L2 quadtree and repeatedly deletes the last subtree', async function() {
      page.on('dialog', async dialog => {
        await dialog.accept();
      });
      let deleteButton = await page.$$('div#datafields > div.datatier > div.fieldvalue input[title="Delete this level"]');
      deleteButton.length.should.be.eql(4);
      for (let i = deleteButton.length - 1; i >= 0; i--) {
        await deleteButton[i].click();
        await page.waitForTimeout(100);
      }
      let tierCount = await page.$$('div.datatier');
      return tierCount.length.should.eql(0);
    }).timeout(20000);
    it('Takes a complete L2 quadtree and repeatedly deletes the first subtree', async function() {
      page.on('dialog', async dialog => {
        await dialog.accept();
      });
      for (let i = 4; i > 0; i--) {
        let deleteButton = await page.$('div#datafields > div.datatier > div.fieldvalue input[title="Delete this level"]');
        deleteButton.should.not.eql(null);
        await deleteButton.click();
        await page.waitForTimeout(100);
      }
      let tierCount = await page.$$('div.datatier');
      return tierCount.length.should.eql(0);
    }).timeout(20000);
    it('Takes a complete L2 quadtree, collapses all subtrees, and then uncollapses them', async function () {
      let collapseButton = await page.$$('div#datafields > div.datatier > div.fieldvalue input[title="Collapse this level"]');
      collapseButton.length.should.be.eql(4);
      for (let i = collapseButton.length - 1; i >= 0; i--) {
        await collapseButton[i].click();
        await page.waitForTimeout(100);
      }
      let tierCount = await page.$$('div.datatier');
      tierCount.length.should.eql(4);
      let expandButton = await page.$$('div#datafields > div.datatier > div.fieldvalue input[title="Expand this field"]');
      expandButton.length.should.be.eql(4);
      for (let i = expandButton.length - 1; i >= 0; i--) {
        await expandButton[i].click();
        await page.waitForTimeout(100);
      }
      tierCount = await page.$$('div.datatier');
      return tierCount.length.should.eql(20);
    });
  });

  describe('End-to-end tests', function() {
    it('From the root, directly access a new editable document', async function() {
      await Promise.all([
        page.goto(host),
        page.waitForNavigation()
      ]);
      status.should.eql(200);
      let links = await page.$x('//a[contains(., "New Data Entry")]');
      await Promise.all([
        links[Math.floor(Math.random() * links.length)].click(),
        page.waitForNavigation({waitFor: 'networkIdle2'})
      ]);
      return page.$x('//h1[contains(., "New Entry")]')
        .should.not.eventually.be.eql([]); 
    });
    it('From the calendar, find and access a JSON document', async function() {
      await Promise.all([
        page.goto([host, 'calendar', year, month].join('/')),
        page.waitForNavigation()
      ]);
      status.should.eql(200);
      page.$x('//h1[contains(., "Calendar")]')
        .should.not.eventually.be.eql([]); 
      let hotlink = await page.$$('li.hot a');
      await Promise.all([
        hotlink[0].click(),
        page.waitForNavigation({waitFor: 'networkIdle2'})
      ]);
      hotlink = await page.$$('td a');
      await Promise.all([
        hotlink[0].click(),
        page.waitForNavigation({waitFor: 'networkIdle2'})
      ]);
      return page.$x('//h1[contains(., "Edit Entry")]')
        .should.not.eventually.be.eql([]); 
    });
    it('Add content to a new JSON document and save said document');
    it('Add content to an existing JSON document and save said document');
    it('Remove content from an existing JSON document and save said document');
    it('Delete the previously created test document');
  });
}).timeout(20000);
