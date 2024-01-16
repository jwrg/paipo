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

  describe('returns 200', function() {
    describe('and renders an existing document when a client', function() {
        it('requests the data resource with id equal to one', async function() {
          await Promise.all([
            page.goto([host, resource, 1].join('/')),
            page.waitForNavigation()
          ]);
          status.should.eql(200);
          return page.$x('//h1[contains(., "Edit Entry")]')
            .should.not.eventually.be.eql([]);
        });
    });

    describe('and renders a new (empty) document when a client', function() {
      it('requests the data resource with id null', async function() {
        await Promise.all([
          page.goto([host, resource, 'null'].join('/')),
          page.waitForNavigation()
        ]);
        status.should.eql(200);
        return page.$x('//h1[contains(., "New Entry")]')
          .should.not.eventually.be.eql([]);
      });

      it('requests a data resource with a bogus (non-numeric) id', async function() {
        await Promise.all([
          page.goto([host, resource, 'b0gus1D'].join('/')),
          page.waitForNavigation()
        ]);
        status.should.eql(200);
        return page.$x('//h1[contains(., "New Entry")]')
          .should.not.eventually.be.eql([]);
      });
    });
  });

  describe('when a user creates a (complete) tree four nodes breadth and two levels deep', function() {
    this.retries(2);
    beforeEach(async function() {
      this.timeout(10000);
      let multiClick = async (handle, count, delay = 0) => {
        for (count; count > 0; count--) {
          await Promise.all([
            handle.click(),
            page.waitForTimeout(delay)
          ]);
        }
      };
      const [ response ] = await Promise.all([
        page.goto([host, resource, 'null'].join('/')),
        page.waitForNavigation()
      ]);
      let tierCount = await page.$$('section.datatier');
      tierCount.length.should.eql(0);
      let addButton = await page.$('input[value="Add a datafield"]');
      await multiClick(addButton, 4, 100);
      tierCount = await page.$$('section.datatier');
      tierCount.length.should.eql(4);
      let expandButton = await page.$$('input[title="Expand this field"]');
      expandButton.length.should.eql(4);
      for (let i = expandButton.length - 1; i >= 0; i--) {
        await expandButton[i].click();
      }
      tierCount = await page.$$('section.datatier');
      tierCount.length.should.eql(8);
      let addSub = await page.$$('input[title="Add a subfield"]');
      addSub.length.should.eql(4);
      for (let i = addSub.length - 1; i >= 0; i--) {
        await multiClick(addSub[i], 3, 100);
      }
      tierCount = await page.$$('section.datatier');
      return tierCount.length.should.eql(20);
    });
    it('can delete all children but the last of each parent', async function() {
      let allButtons = new Array();
      for (let i = 3; i < 6; i++) {
        let deleteButton = await page.$$('section#datafields > section.datatier section.datatier:nth-of-type(' + String(i) + ') input[title="Delete this field"]');
        deleteButton.length.should.eql(4);
        deleteButton.forEach((el) => allButtons.push(el));
      }
      allButtons.length.should.eql(12);
      await page.waitForTimeout(500);
        for (let k = 0; k < allButtons.length; k++) {
          await allButtons[k].click();
          await page.waitForTimeout(100);
      }
      await page.waitForTimeout(500);
      let tierCount = await page.$$('section.datatier');
      return tierCount.length.should.eql(8);
    }).timeout(20000);
    it('can delete all second children of each parent', async function() {
      let deleteButton = await page.$$('section#datafields > section.datatier > section.datatier:nth-child(5) input.button[title="Delete this field"]');
      deleteButton.length.should.eql(4);
      for (let k = 0; k < deleteButton.length; k++) {
        await Promise.all([
          deleteButton[k].click(),
          page.waitForTimeout(100)
        ]);
      }
      let tierCount = await page.$$('section.datatier');
      // Need to test whether a second sibling datatier exists
      return tierCount.length.should.eql(16);
    }).timeout(20000);
    it('can delete all parents by randomly clicking delete level buttons', async function() {
      page.on('dialog', async dialog => {
        await dialog.accept();
      });
      let deleteButtons = await page.$$('section#datafields > section.datatier > section.fieldvalue input[title="Delete this level"]');
      deleteButtons.length.should.eql(4);
      let buttonsLength = deleteButtons.length;
      for (let i = 0; i < buttonsLength; i++) {
        let randomValue = Math.floor(Math.random() * deleteButtons.length);
        let deleteButton = deleteButtons[randomValue];
        deleteButton.should.not.eql(null);
        await Promise.all([
          deleteButton.click(),
          page.waitForTimeout(100)
        ]);
        deleteButtons.splice(deleteButtons.indexOf(deleteButton), 1);
      }
      let tierCount = await page.$$('section.datatier');
      return tierCount.length.should.eql(0);
    }).timeout(20000);
    it('can delete all parents by clicking the first delete level button', async function() {
      page.on('dialog', async dialog => {
        await dialog.accept();
      });
      let deleteButtons = await page.$$('section#datafields > section.datatier > section.fieldvalue input[title="Delete this level"]');
      deleteButtons.length.should.eql(4);
      for (let i = 0; i < deleteButtons.length; i++) {
        let deleteButton = await page.$('section#datafields > section.datatier > section.fieldvalue input[title="Delete this level"]');
        deleteButton.should.not.eql(null);
        await Promise.all([
          deleteButton.click(),
          page.waitForTimeout(100)
        ]);
      }
      let tierCount = await page.$$('section.datatier');
      return tierCount.length.should.eql(0);
    }).timeout(20000);
    it('can collapses all subtrees, and then uncollapse them', async function () {
      let collapseButtons = await page.$$('section#datafields > section.datatier > section.fieldvalue input[title="Collapse this level"]');
      collapseButtons.length.should.eql(4);
      let buttonsLength = collapseButtons.length;
      for (let i = 0; i < buttonsLength; i++) {
        let collapseButton = await page.$('section#datafields > section.datatier > section.fieldvalue input[title="Collapse this level"]');
        collapseButton.should.not.eql(null);
        await Promise.all([
          collapseButton.click(),
          page.waitForTimeout(200)
        ]);
      }
      let tierCount = await page.$$('section.datatier');
      tierCount.length.should.eql(4);
      let expandButtons = await page.$$('section#datafields > section.datatier > section.fieldvalue input[title="Expand this field"]');
      expandButtons.length.should.be.eql(4);
      buttonsLength = expandButtons.length;
      for (let i = 0; i < buttonsLength; i++) {
        let randomValue = Math.floor(Math.random() * expandButtons.length);
        let expandButton = expandButtons[randomValue];
        expandButton.should.not.eql(null);
        await Promise.all([
          expandButton.click(),
          page.waitForTimeout(100)
        ]);
        expandButtons.splice(expandButtons.indexOf(expandButton), 1);
      }
      tierCount = await page.$$('section.datatier');
      return tierCount.length.should.eql(20);
    }).timeout(20000);
  });

  describe('from end to end', function() {
    beforeEach(async () => {
      await Promise.all([
        page.goto(host),
        page.waitForNavigation()
      ]);
      status.should.eql(200);
    });
    it('can directly access a new editable document', async function() {
      let links = await page.$x('//a[contains(., "New Data Entry")]');
      links.should.not.eql([]);
      await Promise.all([
        //links[Math.floor(Math.random() * links.length)].click(),
        links[1].click(),
        page.waitForNavigation({waitFor: 'networkIdle2'})
      ]);
      return page.$x('//h1[contains(., "New Entry")]')
        .should.not.eventually.be.eql([]); 
    });
    it('selects and accesses a data resource via the month and date views');
    it('adds content to a new JSON document and save said document');
    it('adds content to an existing JSON document and save said document');
    it('removes content from an existing JSON document and save said document');
    it('deletes the previously created test document');
  });
}).timeout(20000);
