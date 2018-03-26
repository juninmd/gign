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

        let [projectTags, ignoreManual] = project(dir);

        tags.push(...projectTags);

        let path = await download({
            directory: dir,
            tags
        });


        let structManual = '';
        Object.keys(ignoreManual).map(q => {
            let i = ignoreManual[q];
            structManual += `# ${q}\r\n${i.values.join('\r\n')}`
        })

        if (structManual)
            fs.appendFileSync(path, structManual);

        if (Object.keys(ignoreManual).length == 0 && projectTags.length == 0) {
            console.info(`[gign] nothing detected`)
            return;
        }

        console.info(`[gign] generated at ${path}`)
        if (projectTags.length > 0)
            console.info(`[gign] tags: ${tags}`)
        if (Object.keys(ignoreManual).length > 0)
            console.info(`[gign] manual tags: ${Object.keys(ignoreManual)}`)
    } catch (ex) {
        console.error(`[gign] ${ex.message}`);
    }
}

module.exports = (dir) => {
    return doit(dir);
}