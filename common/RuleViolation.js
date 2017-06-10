'use strict';

function RuleViolation(o) {
    for (var prop in o) {
        this[prop] = o[prop];
    }
    if ('indexes' in this) {
        this.quantity = this.indexes.length;
    }
 }

module.exports = RuleViolation;
