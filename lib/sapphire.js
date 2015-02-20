'use strict';

var _util      = require('util'),
    _          = require('lodash'),
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
    coffee     = require('gulp-coffee'),
    util       = require('gulp-util'),
    minifyCss  = require('gulp-minify-css'),
    less       = require('gulp-less'),
    sass       = require('gulp-sass'),
    clean      = require('gulp-clean'),
    replace    = require('gulp-replace'),
    order      = require('gulp-order'),
    gzip       = require("gulp-gzip"),
    es         = require('event-stream')
;


function js (patten, replace) {
    return function (filepath) {
        return _util.format( '<script type="text/javascript" src="%s"></script>', filepath.replace( patten, replace ));
    };
}

function css (patten, replace) {
    return function (filepath, file, index, length) {
        return _util.format( '<link rel="stylesheet" href="%s">', filepath.replace( '/public', '' ));
    };
}

function jsInline (filepath, file) {
    return _util.format( '<script type="text/javascript">%s</script>', file.contents.toString());
}

function cssInline (filepath, file) {
    return _util.format( '<style>%s</style>', file.contents.toString());
}


function Sapphire(options) {

    var self = this;

    // Set options
    _.extend(self.options, options);
}

Sapphire.es                 = es;

Sapphire.assets             = gulp;

Sapphire.assets.swapCache   = swapCache;
Sapphire.assets.memoryCache = {};

Sapphire.assets.inject      = inject;
Sapphire.assets.if          = gulpif;

Sapphire.assets.jade        = jade;

// concat and minification related methods
Sapphire.assets.concat     = concat;
Sapphire.assets.imagemin   = imagemin;
Sapphire.assets.uglify     = uglify;
Sapphire.assets.minifyHtml = minifyHtml;
Sapphire.assets.minifyCss  = minifyCss;

Sapphire.assets.coffee     = coffee;
Sapphire.assets.less       = less;
Sapphire.assets.sass       = sass;

Sapphire.assets.util       = util;

Sapphire.assets.clean      = clean;
Sapphire.assets.replace    = replace;
Sapphire.assets.rev        = rev;
Sapphire.assets.order      = order;

Sapphire.assets.gzip       = gzip;

Sapphire.transformer       = {
    js       : js,
    jsInline : jsInline,
    css      : css,
    cssInline: cssInline
};

Sapphire.prototype.assets      = Sapphire.assets;
Sapphire.prototype.transformer = Sapphire.transformer;
Sapphire.prototype.es          = Sapphire.es;

module.exports = Sapphire;