'use strict';

var _    = require('lodash'),
    gulp = require('gulp');

function Sapphire(options) {

    var self = this;

    // Set options
    _.extend(self.options, options);
}

Sapphire.prototype.asset = Sapphire.asset = gulp;

module.exports = Sapphire;