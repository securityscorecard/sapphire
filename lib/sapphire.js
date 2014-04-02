'use strict';

var _         = require('lodash'),
    gulp      = require('gulp'),
    swapCache = require('gulp-cache'),
    inject    = require('gulp-inject'),
    jade      = require('gulp-jade'),
    gulpif    = require('gulp-if')
;

function Sapphire(options) {

    var self = this;

    // Set options
    _.extend(self.options, options);
}

Sapphire.assets             = gulp;

Sapphire.assets.swapCache   = swapCache;
Sapphire.assets.memoryCache = {};

Sapphire.assets.inject      = inject;
Sapphire.assets.if          = gulpif;

Sapphire.assets.jade        = jade;

Sapphire.prototype.assets = Sapphire.assets;

module.exports = Sapphire;