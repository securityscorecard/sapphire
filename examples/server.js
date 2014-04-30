'use strict';

var path            = require('path'),
    util            = require('util'),
    express         = require('express'),
    app             = express(),
    Sapphire        = require('../'),
    sapphire        = new Sapphire(),
    cache
;


app.use(express.logger('dev'));
app.use(express.static(__dirname + '/client'));


function assetsTransformerJs(filepath, file, index, length) {
    return util.format( '<script type="text/javascript" src="%s"></script>', filepath.replace( '/client', '' ));
}

function assetsTransformerCss(filepath, file, index, length) {
    return util.format( '<link rel="stylesheet" href="%s">', filepath.replace( '/client', '' ));
}

function assetsTransformerInlineJs(filepath, file, index, length) {
    return util.format( '<script type="text/javascript">%s</script>', file.contents.toString());
}

function assetsTransformerInlineCss(filepath, file, index, length) {
    return util.format( '<style>%s</style>', file.contents.toString());
}

/**
 * Raw view with no compression or minification
 * @param  {Object} res  connect `response` object
 */
function sendView(res) {
    var jsStream, cssStream, viewStream;

    jsStream   = sapphire.assets.src('./client/js/**/*.js', {read: false});
    cssStream  = sapphire.assets.src('./client/css/**/*.css', {read: false});

    viewStream = sapphire.assets.src('./client/views/desktop.jade')
        .pipe(sapphire.assets.jade({locals: {date: new Date()}}))
        .pipe(sapphire.assets.inject(jsStream,  {starttag: '<!-- inject:head:{{ext}} -->', transform: assetsTransformerJs }))
        .pipe(sapphire.assets.inject(cssStream, {starttag: '<!-- inject:head:{{ext}} -->', transform: assetsTransformerCss }));

    // sending html page to the client
    viewStream.on('data', function(data) {
        data.pipe(res);
    });
}

/**
 * View with minified `css` and `js` files
 * @param  {Object} res  connect `response` object
 */
function sendMinifiedView(res) {
    var jsStream, cssStream, viewStream;

    sapphire.assets.src('./client/assets/**', {read: false})
        .pipe(sapphire.assets.clean());

    jsStream = sapphire.assets.src('./client/js/**/*.js')
        .pipe(sapphire.assets.concat('all.min.js'))
        .pipe(sapphire.assets.uglify())
        .pipe(sapphire.assets.rev())
        .pipe(sapphire.assets.dest('./client/assets'))
    ;

    cssStream = sapphire.assets.src('./client/css/**/*.css')
        .pipe(sapphire.assets.minifyCss())
        .pipe(sapphire.assets.concat('all.min.css'))
        .pipe(sapphire.assets.rev())
        .pipe(sapphire.assets.dest('./client/assets'))
    ;

    viewStream = sapphire.assets.src('./client/views/desktop.jade')
        .pipe(sapphire.assets.jade({locals: {date: new Date()}}))
        .pipe(sapphire.assets.inject(jsStream,  {starttag: '<!-- inject:head:{{ext}} -->', transform: assetsTransformerJs }))
        .pipe(sapphire.assets.inject(cssStream, {starttag: '<!-- inject:head:{{ext}} -->', transform: assetsTransformerCss }))
    ;

    // sending html page to the client
    viewStream.on('data', function(data) {
        data.pipe(res);
    });
}

/**
 * View with minified inline `css` and `js` files and minified `html` output
 * @param  {Object} res  connect `response` object
 */
function sendMinifiedInlineView(res) {
    var jsStream, cssStream, viewStream;

    jsStream = sapphire.assets.src('./client/js/**/*.js')
        .pipe(sapphire.assets.uglify())
        // .pipe(sapphire.assets.concat('all.min.js'))
    ;

    cssStream = sapphire.assets.src('./client/css/**/*.css')
        .pipe(sapphire.assets.minifyCss())
        // .pipe(sapphire.assets.concat('all.min.css'))
    ;

    viewStream = sapphire.assets.src('./client/views/desktop.jade')
        .pipe(sapphire.assets.jade({locals: {date: new Date()}}))
        .pipe(sapphire.assets.inject(jsStream,  {starttag: '<!-- inject:head:{{ext}} -->', transform: assetsTransformerInlineJs }))
        .pipe(sapphire.assets.inject(cssStream, {starttag: '<!-- inject:head:{{ext}} -->', transform: assetsTransformerInlineCss }))
        .pipe(sapphire.assets.minifyHtml())
    ;

    // sending html page to the client
    viewStream.on('data', function(data) {
        data.pipe(res);
    });
}

/**
 * CACHED View with minified inline `css` and `js` files and minified `html` output
 * @param  {Object} res  connect `response` object
 */
function sendMinifiedInlineCachedView(res) {
    var jsStream, cssStream, viewStream;

    res.header('Content-Encoding', 'gzip');

    if (cache) {
        console.log('from cache!');
        cache.pipe(res);

    } else {
        jsStream = sapphire.assets.src('./client/js/**/*.js')
            .pipe(sapphire.assets.uglify())
        ;

        cssStream = sapphire.assets.src('./client/css/**/*.css')
            .pipe(sapphire.assets.minifyCss())
        ;

        viewStream = sapphire.assets.src('./client/views/desktop.jade')
            .pipe(sapphire.assets.jade({locals: {date: new Date()}}))
            .pipe(sapphire.assets.inject(jsStream,  {starttag: '<!-- inject:head:{{ext}} -->', transform: assetsTransformerInlineJs }))
            .pipe(sapphire.assets.inject(cssStream, {starttag: '<!-- inject:head:{{ext}} -->', transform: assetsTransformerInlineCss }))
            .pipe(sapphire.assets.minifyHtml())
            .pipe(sapphire.assets.gzip())
        ;

        // sending html page to the client
        viewStream.on('data', function(data) {
            cache = data;
            data.pipe(res);
        });
    }

}

app.get('/', function(req, res) {
    sendView(res);
});

app.get('/minified', function(req, res) {
    sendMinifiedView(res);
});

app.get('/minified/inline', function(req, res) {
    sendMinifiedInlineView(res);
});

app.get('/minified/inline/cached', function(req, res) {
    sendMinifiedInlineCachedView(res);
});

app.listen(3333, function(){
    console.log('Server runs on http://0.0.0.0:3333');
});