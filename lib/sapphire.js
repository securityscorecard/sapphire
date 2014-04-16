'use strict';

var _          = require('lodash'),
    gulp       = require('gulp'),
    swapCache  = require('gulp-cache'),
    inject     = require('gulp-inject'),
    jade       = require('gulp-jade'),
    gulpif     = require('gulp-if'),
    concat     = require('gulp-concat'),
    imagemin   = require('gulp-imagemin'),
    uglify     = require('gulp-uglify'),
    minifyHtml = require('gulp-minify-html'),
    rev        = require('gulp-rev'),
    minifyCss  = require('gulp-minify-css'),
    clean  = require('gulp-clean')
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

// cocat and minification related methods
Sapphire.assets.concat     = concat;
Sapphire.assets.imagemin   = imagemin;
Sapphire.assets.uglify     = uglify;
Sapphire.assets.minifyHtml = minifyHtml;
Sapphire.assets.minifyCss  = minifyCss;
Sapphire.assets.clean      = clean;
Sapphire.assets.rev        = rev;

Sapphire.prototype.assets = Sapphire.assets;

module.exports = Sapphire;