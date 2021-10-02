const fs = require('fs');
const path = require('path');
const sass = require('sass');

function iterate_scss_files(inputDir, options, callback) {
    let files = fs.readdirSync(inputDir, { withFileTypes: true });
    files.forEach((dirEnt) => {
        if (dirEnt.isFile()) {
            if (dirEnt.name.endsWith(options.sass_ext)) {
                callback(undefined, inputDir, dirEnt);
            }
        } else if (dirEnt.isDirectory()) {
            iterate_scss_files(path.join(inputDir, dirEnt.name), options, callback);
        }
    });
}

function set_files_to_watch(eleventyConfig, options) {
    iterate_scss_files(options.input_dir, options, (err, dirPath, dirEnt) => {
        if (err) {
            console.error(`[dart-sass] Error: ${err}`);
            reject(err);
        } else {
            const watchFile = path.join(dirPath, dirEnt.name);
            console.log(`[dart-sass] Watching ${watchFile}`);
            eleventyConfig.addWatchTarget(watchFile);
        }
    });
}

function build_scss_files(inputDir, options) {
    iterate_scss_files(inputDir, options, (err, dirPath, dirEnt) => {
        if (!dirEnt.name.startsWith('_')) {
            const compiledName = path.basename(dirEnt.name, options.sass_ext).concat(options.output_ext);
            const outFile = path.join(options.output_dir, compiledName);
            console.log(`[dart-sass] Compiling ${dirEnt.name} -> ${outFile}`);
            sass.render({
                file: path.join(dirPath, dirEnt.name),
                outFile: outFile
            }, (err, result) => {
                if (err) {
                    console.error(`[dart-sass] Error: ${err}`);
                    return;
                }
                fs.writeFile(outFile, Buffer.from(result.css), {}, (err) => {
                    if (err) {
                        console.error(`[dart-sass] Error: ${err}`);
                    }
                });
            });
        }
    });
}

module.exports = function (eleventyConfig, options = {}) {
    let sass_options = Object.assign({
        input_dir: eleventyConfig.dir.input,
        output_dir: '',
        sass_ext: '.scss',
        output_ext: '.css'
    }, options);

    set_files_to_watch(eleventyConfig, sass_options);
    sass_options.output_dir = path.join(eleventyConfig.dir.output, sass_options.output_dir);
    console.log(`[dart-sass] Creating ${sass_options.output_dir}`);
    fs.mkdirSync(sass_options.output_dir, { recursive: true });

    eleventyConfig.on('beforeBuild', () => {
        build_scss_files(sass_options.input_dir, sass_options);
    });
}