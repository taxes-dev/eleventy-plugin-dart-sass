## eleventy-plugin-dart-sass

_Very_ simple plugin to compile .scss files into .css as part of an [Eleventy](https://www.11ty.dev/) build.

### Usage

Install:

```
npm install --save-dev git+https://git.taxes.dev/taxes/eleventy-plugin-dart-sass.git
```

Usage (in `.eleventy.js`):

```javascript
const pluginSass = require("@taxes/eleventy-plugin-dart-sass");

module.exports = function (eleventyConfig) {  
    eleventyConfig.addPlugin(pluginSass, {
        /* required. relative to your Eleventy output dir */
        output_dir: 'css',

        /* optional. defaults to your Eleventy input dir and relative to Eleventy's execution dir */
        input_dir: 'src',

        /* optional. file extension for input SASS files, defaults to .scss */
        sass_ext: '.scss',

        /* optional. file extension for output CSS files, defaults to .css */
        output_ext: '.css'
    });
};
```

The plugin will recurse through `input_dir`, looking for files that end with the `sass_ext` extension. The files are compiled to CSS and placed in `output_dir`. Note that all files will go into the same `output_dir` without preserving paths, so if two files are named the same but in different input folders, they will overwrite each other.

### License

Distributed under an [MIT license](LICENSE). You're welcome to copy, modify, and distribute, so long as you follow the rules of the license.
