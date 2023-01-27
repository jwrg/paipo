// Required for tests
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();

// Puppeteer for user-imitation in end-to-end tests
const puppeteer = require('puppeteer');
const pti = require('puppeteer-to-istanbul');

// End to end tests for month view
describe('View: Month', function() {
  let browser;
  let page;
  let months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December',
  ];
  let today = new Date();
  let month = months[today.getMonth()];
  let year = today.getFullYear();
  let host = 'localhost:6891';
  let resource = 'calendar';

  before(async () => {
    browser = await puppeteer.launch({
      "args": ["--no-sandbox"],
      "headless": true,
      "sloMo": 50,
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
    [...Array(12).keys()].forEach(el => {
      it('Month ' + months[el] + ' returns 200 for the current year', async function() {
        const [ response ] = await Promise.all([
          page.goto([host, resource, year, el].join('/')),
          page.waitForNavigation()
        ]);
        return response._status.should.eql(200);
      });
    });

    [-3000, -2, -1, 12, 13, 1400].forEach(el => {
      it('Requesting month number ' + el + ' returns 500', async function() {
        const [ response ] = await Promise.all([
          page.goto([host, resource, year, el].join('/')),
          page.waitForNavigation()
        ]);
        return response._status.should.eql(500);
      });
    });

    it('Requesting year zero returns 500 (lol Y2K)', async function() {
      const [ response ] = await Promise.all([
        page.goto([host, resource, 0, 1].join('/')),
        page.waitForNavigation()
      ]);
      return response._status.should.eql(500);
    });

    it('Requesting a negative year returns 500 (sorry ancients)', async function() {
      const [ response ] = await Promise.all([
        page.goto([host, resource, -81, 1].join('/')),
        page.waitForNavigation()
      ]);
      return response._status.should.eql(500);
    });
  });

  describe('End-to-end tests', function() {
    it('When at the root, clicking on month view gets the current month (' + month + ')', async function() {
      const [ response ] = await Promise.all([
        page.goto(host),
        page.waitForNavigation()
      ]);
      let links = await page.$x('//a[contains(., "calendar") or contains(., "Calendar")]');
      await Promise.all([
        links[Math.floor(Math.random() * links.length)].click(),
        page.waitForNavigation({waitFor: 'networkIdle2'})
      ]);
      return page.$x('//li[contains(., "' + month + '")]')
        .should.not.eventually.be.eql([]); 
    });

    it('Clicking for the previous month on January wraps around to December of the previous year', async function() {
      const [ response ] = await Promise.all([
        page.goto([host, resource, year, 0].join('/')),
        page.waitForNavigation()
      ]);
      let prevButton = await page.$('li.previous a');
      await Promise.all([
        prevButton.click(),
        page.waitForNavigation()
      ]);
      return page.$x('//li[contains(., "December")]')
        .should.not.eventually.be.eql([]);
    });

    it('Clicking for the next month on December wraps around to January of the next year', async function() {
      const [ response ] = await Promise.all([
        page.goto([host, resource, year, 11].join('/')),
        page.waitForNavigation()
      ]);
      let prevButton = await page.$('li.next a');
      await Promise.all([
        prevButton.click(),
        page.waitForNavigation()
      ]);
      return page.$x('//li[contains(., "January")]')
        .should.not.eventually.be.eql([]);
    });

    it('Clicking on the current month changes to a new month via a dialog', async function() {
      const [ response ] = await Promise.all([
        page.goto([host, resource, year, today.getMonth()].join('/')),
        page.waitForSelector('a#current_month')
      ]);
      await page.click('a#current_month');
      let years = await page.$$('section#modal select#select_year option');
      let randomMonth = Math.floor(Math.random() * months.length);
      let randomYear = 2023 - Math.floor(Math.random() * years.length);
      await page.select('select#select_month', '' + randomMonth);
      await page.select('select#select_year', '' + randomYear);
      await Promise.all([
          page.click('section#modal button.submit'),
          page.waitForNavigation()
      ]);
      page.$x('//a[contains(., "' + randomYear + '")]')
        .should.not.eventually.be.eql([]);
      return page.$x('//a[contains(., "' + months[randomMonth] + '")]')
        .should.not.eventually.be.eql([]);
    });

    it('Clicking on the current month and then on cancel does nothing', async function() {
      const [ response ] = await Promise.all([
        page.goto([host, resource, year, today.getMonth()].join('/')),
        page.waitForSelector('a#current_month')
      ]);
      await page.click('a#current_month');
      await page.click('section#modal button.cancel');
      page.$x('//a[contains(., "' + year + '")]')
        .should.not.eventually.be.eql([]);
      return page.$x('//a[contains(., "' + month + '")]')
        .should.not.eventually.be.eql([]);
    });
  });
}).timeout(20000);

