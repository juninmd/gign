const download = require('download')
const path = require('path');
const fs = require('fs');
const loading = require('loading-indicator');

module.exports = (options) => {
    return new Promise((resolve, reject) => {
        const timer = loading.start('Download...');
        download(`https://www.gitignore.io/api/${options.tags}`)
            .then(data => {
                loading.stop(timer);
                fs.writeFileSync(`${options.directory}//.gitignore`, data);
                return resolve(path.join(options.directory, '.gitignore'));
            }).catch(err => {
                loading.stop(timer);
                return reject(err);
            });
    })
}
