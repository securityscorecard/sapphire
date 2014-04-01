'use strict';

var jade            = require('gulp-jade'),
    inject          = require('gulp-inject'),
    path            = require('path'),
    util            = require('util'),
    cache           = require('gulp-cache'),
    express         = require('express'),
    app             = express(),
    assetsFormatter = require('../lib/gulp-assets.js'),
    Sapphire        = require('../'),
    sapphire        = new Sapphire();


function assetsTransformerJs(filepath, file, index, length) {
    return util.format( '<script src="%s"></script>', filepath.replace( '/client', '' ));
}

function assetsTransformerCss(filepath, file, index, length) {
    return util.format( '<link rel="stylesheet" href="%s">', filepath.replace( '/client', '' ));
}


function getDesktopView(res) {
    var js     = sapphire.asset.src('./client/js/**/*.js', {read: false}),
        css    = sapphire.asset.src('./client/css/**/*.css', {read: false});

        // prepearing the view
        sapphire.asset.src('./client/views/desktop.jade')
            .pipe(cache(jade({locals: {date: new Date()}})))
            .pipe(inject(js,  {starttag: '<!-- inject:head:{{ext}} -->', transform: assetsTransformerJs }))
            .pipe(inject(css, {starttag: '<!-- inject:head:{{ext}} -->', transform: assetsTransformerCss }))
            // sending compiled result to the client
            .on('data', function(data) {
                // console.log('data', data);
                data.pipe(res);
            });
}

app.get('/', function(req, res) {
    getDesktopView(res);
});

app.listen(3333);