/**
 * Created by pavel on 24.5.16.
 */
'use strict';
var Stack = function() {
    this._stack = [];
};

Stack.prototype.push = function (item) {
    return this._stack.push(item);
};

Stack.prototype.pop = function(){
    return this._stack.pop();
};

Stack.prototype.size = function(){
    return this._stack.length;
};

Stack.prototype.hasNext = function(){
    return this.size()>0;
};

module.exports = Stack;