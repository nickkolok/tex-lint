'use strict';

var unique = require('array-unique');

function RuleViolation(o) {
    for (var prop in o) {
        this[prop] = o[prop];
    }
    if ('indexes' in this) {
        // Мало ли что сюда передали, чтоб не попортить
        this.indexes = this.indexes.slice();
        this.indexes = this.indexes.sort(function(a, b) { return a - b; });
        unique(this.indexes);
        this.quantity = this.indexes.length;
    }
 }

module.exports = RuleViolation;
