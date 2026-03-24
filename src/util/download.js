const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const loading = require('loading-indicator');

module.exports = (options) => {
  return new Promise((resolve, reject) => {
    const timer = loading.start('Download...');
    fetch(`https://www.toptal.com/developers/gitignore/api/${options.tags}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch from gitignore.io: ${res.statusText}`);
        }
        return res.text();
      })
      .then((data) => {
        loading.stop(timer);
        const outputPath = path.join(options.directory, '.gitignore');
        fs.writeFileSync(outputPath, data);
        return resolve(outputPath);
      })
      .catch((err) => {
        loading.stop(timer);
        return reject(new Error(`Download failed: ${err.message}`));
      });
  });
};
