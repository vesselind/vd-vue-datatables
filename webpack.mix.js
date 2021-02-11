const mix = require('laravel-mix');

mix.js('./src/index.js', 'dist/index.js').vue();

mix.webpackConfig({
    output: {
        libraryTarget: 'umd',
    },

    externals: {
        "jquery": "jQuery",
        "bootstrap" : "bootstrap",
        "popper.js": "popper.js",
        "fontawesome-free" : "@fortawesome/fontawesome-free",
        "toastr" : "toastr",
        "vue-select" : "vue-select",
        "@popperjs/core" : "@popperjs/core"
    }

});