// Required for tests
var chai = require('chai');
//var chaiAsPromised = require("chai-as-promised");
//chai.use(chaiAsPromised);
var should = chai.should();
var rewire = require('rewire');

// Module being tested
var editentry = rewire('../../script/editentry.js');

// Functions being tested
incrementIdentifier = editentry.__get__('incrementIdentifier');
decrementIdentifier = editentry.__get__('decrementIdentifier');

describe('script/editentry.js', function() {
  describe('incrementIdentifier(str)', function() {
    it('increments the last number in an identifier string, assuming the last character in the string is a number', function () {
      incrementIdentifier('identifier_1').should.eql('identifier_2');
      incrementIdentifier('identifier_75').should.eql('identifier_76');
      incrementIdentifier('identifier_100_1000_10000').should.eql('identifier_100_1000_10001');
    });
  });
  describe('decrementIdentifier(str)', function() {
    it('decrements the last number in an identifier string, assuming the last character in the string is a number', function () {
      decrementIdentifier('identifier_1').should.eql('identifier_0');
      decrementIdentifier('identifier_75').should.eql('identifier_74');
      decrementIdentifier('identifier_100_1000_10000').should.eql('identifier_100_1000_9999');
    });
  });
});
