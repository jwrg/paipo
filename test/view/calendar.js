// Required for tests
var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();

// Puppeteer for user-imitation in end-to-end tests
const puppeteer = require('puppeteer');

// End to end tests for calendar view
describe('View: Calendar', function() {
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

  before(async () => {
    browser = await puppeteer.launch({
      "args": ["--no-sandbox"],
      "headless": false,
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
    // Give promises time to resolve before starting
    // the next test
    await page.waitFor(1500);
    await page.close();
  });
  after(async () => {
    await browser.close();
  });

  it('When at the root, clicking on calendar view gets the current month (' + month + ')', async function() {
    const [ response ] = await Promise.all([
      page.goto('localhost:6891'),
      page.waitForNavigation()
    ]);
    let links = await page.$x('//a[contains(., "calendar") or contains(., "Calendar")]');
    await Promise.all([
      links[Math.floor(Math.random() * links.length)].click(),
      page.waitForNavigation({waitFor: 'networkIdle2'})
    ]);
    page.$x('//li[contains(., "' + month + '")]')
      .should.not.eventually.be.eql([]); 
  });
  
  it('Clicking for the previous month on January wraps around to December of the previous year', async function() {
    const [ response ] = await Promise.all([
      page.goto('localhost:6891/calendar/' + year + '/0'),
      page.waitForNavigation()
    ]);
    let prevButton = await page.$('li.previous a');
    await Promise.all([
      prevButton.click(),
      page.waitForNavigation()
    ]);
    page.$x('//li[contains(., "December")]')
      .should.not.eventually.be.eql([]);
  });

  it('Clicking for the next month on December wraps around to January of the next year', async function() {
    const [ response ] = await Promise.all([
      page.goto('localhost:6891/calendar/' + year + '/11'),
      page.waitForNavigation()
    ]);
    let prevButton = await page.$('li.next a');
    await Promise.all([
      prevButton.click(),
      page.waitForNavigation()
    ]);
    page.$x('//li[contains(., "January")]')
      .should.not.eventually.be.eql([]);
  });

  [...Array(12).keys()].forEach(el => {
    it('Month ' + months[el] + ' returns 200 for the current year', async function() {
      const [ response ] = await Promise.all([
        page.goto('localhost:6891/calendar/' + year + '/' + el),
        page.waitForNavigation()
      ]);
      response._status.should.eql(200);
    });
  });

  [-2, -1, 12, 13, 14, 15].forEach(el => {
    it('Requesting month number ' + el + ' returns 500', async function() {
      const [ response ] = await Promise.all([
        page.goto('localhost:6891/calendar/' + year + '/' + el ),
        page.waitForNavigation()
      ]);
      response._status.should.eql(500);
    });
  });

  it('Requesting year zero returns 500', async function() {
    const [ response ] = await Promise.all([
      page.goto('localhost:6891/calendar/0/1'),
      page.waitForNavigation()
    ]);
    response._status.should.eql(500);
  });

  it('Requesting a negative year returns 500 (sorry ancients)', async function() {
    const [ response ] = await Promise.all([
      page.goto('localhost:6891/calendar/-81/1'),
      page.waitForNavigation()
    ]);
    response._status.should.eql(500);
  });
}).timeout(20000);

