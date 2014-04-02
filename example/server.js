'use strict';

var path            = require('path'),
    util            = require('util'),
    express         = require('express'),
    app             = express(),
    Sapphire        = require('../'),
    sapphire        = new Sapphire();


function assetsTransformerJs(filepath, file, index, length) {
    return util.format( '<script src="%s"></script>', filepath.replace( '/client', '' ));
}

function assetsTransformerCss(filepath, file, index, length) {
    return util.format( '<link rel="stylesheet" href="%s">', filepath.replace( '/client', '' ));
}


function getDesktopView(res, prod) {
    var js     = sapphire.assets.src('./client/js/**/*.js', {read: false}),
        css    = sapphire.assets.src('./client/css/**/*.css', {read: false}),

        view   = sapphire.assets.src('./client/views/desktop.jade')
            .pipe(sapphire.assets.swapCache(sapphire.assets.jade({locals: {date: new Date()}})))
            .pipe(sapphire.assets.inject(js,  {starttag: '<!-- inject:head:{{ext}} -->', transform: assetsTransformerJs }))
            .pipe(sapphire.assets.if(prod, sapphire.assets.inject(css, {starttag: '<!-- inject:head:{{ext}} -->', transform: assetsTransformerCss })));

        // sending html page to the client
        view.on('data', function(data) {
            data.pipe(res);
        });
}

app.get('/', function(req, res) {
    getDesktopView(res, false);
});

app.listen(3333);