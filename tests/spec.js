/**
 * Created by pavel on 24.5.16.
 */
var assert = require('chai').assert;

var Stack = require('../src/stack');

describe('Stack', function() {
    describe('#size', function () {
        it('should return 1', function () {
            var stack = new Stack();
            stack.push(1);
            assert.equal(1, stack.size());
        });

        it('should return 2', function () {
            var stack = new Stack();
            stack.push(2);
            stack.push(5);
            stack.push(1);
            stack.pop();
            stack.pop();
            assert.equal(1, stack.size());
        });
    });

    describe('#hasNext', function () {
        it('should return true', function () {
            var stack = new Stack();
            stack.push(1);
            assert.equal(true, stack.hasNext());
        });

        it('should return false', function () {
            var stack = new Stack();
            stack.push(2);
            stack.push(5);
            stack.pop();
            stack.pop();
            assert.equal(false, stack.hasNext());
        });

        it('should return 6', function () {
            var stack = new Stack();
            stack.push(1);
            stack.push(2);
            stack.push(3);
            stack.push(4);
            stack.push(5);
            stack.push(6);
            var total = 0;
            while(stack.hasNext()){
                total++;
                stack.pop();
            }
            assert.equal(6, total);
        });
    });

});