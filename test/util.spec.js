var assert            = require('assert');
var generateId        = require('../lib/util').generateId;
var randomCoordinates = require('../lib/util').randomCoordinates;

describe('Utility functions', function () {
    describe('Alphanumeric ID', function (){
        it('should have the correct length', function (){
            assert.equal(5, generateId(5).length);
            assert.equal(10, generateId(10).length);
        });
    });

    describe('Random coordinates', function () {
        it('should return an array', function () {
            assert(Array.isArray(randomCoordinates()));
        });
        
        it('should have two coordinates', function () {
            assert.equal(2, randomCoordinates().length);
        });
    });
});