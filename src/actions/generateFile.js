const os = require('../util/os')
const download = require('../util/download');
const project = require('../util/project');
const fs = require('fs');

async function doit(dir) {
    try {

        if (!fs.existsSync(dir)) {
            console.warn('[gign] Directory does not exist');
            return;
        }

        let tags = [os()];
        tags.push(...project(dir));

        let path = await download({
            directory: dir,
            tags
        });

        console.info(`[gign] generated at ${path}`)
        console.info(`[gign] tags: ${tags}`)

    } catch (ex) {
        console.error(`[gign] ${ex.message}`);
    }
}

module.exports = (dir) => {
    return doit(dir);
}