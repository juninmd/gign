const fs = require('fs');
const path = require('path');
const pattern = require('../../pattern.json');
const manual = require('../../manual.json');

module.exports = (dir) => {
    const tags = [];
    let ignorePaths = {};

    const files = fs.readdirSync(dir);

    if (!files.includes('.git')) {
        console.warn('[gign] Initialize a git repository, use "git init" command')
    }

    // Load custom configuration if available
    let customPattern = [];
    let customManual = [];
    const customConfigPath = path.join(dir, '.gignrc.json');
    if (fs.existsSync(customConfigPath)) {
        try {
            const customConfig = JSON.parse(fs.readFileSync(customConfigPath, 'utf8'));
            if (customConfig.pattern && Array.isArray(customConfig.pattern)) {
                customPattern = customConfig.pattern;
            }
            if (customConfig.manual && Array.isArray(customConfig.manual)) {
                customManual = customConfig.manual;
            }
        } catch (error) {
            console.warn(`[gign] Failed to parse .gignrc.json: ${error.message}`);
        }
    }

    const allPatterns = [...pattern, ...customPattern];
    const allManuals = [...manual, ...customManual];

    allPatterns.map(q => {
        let key = Object.keys(q)[0];
        let itens = q[key];
        let hasMatch = itens.some(r => {
            if (r.startsWith('*')) {
                let ext = r.substring(1);
                return files.some(f => f.endsWith(ext));
            }
            if (r.endsWith('*')) {
                let prefix = r.substring(0, r.length - 1);
                return files.some(f => f.startsWith(prefix));
            }
            if (r.includes("/") || r.includes("\\")) { return fs.existsSync(path.join(dir, r)); } return files.includes(r);
        });
        if (hasMatch && !tags.includes(key))
            tags.push(key);
    })


    allManuals.map(item => {

        item.search.filter(q => {
            let matchedFiles = [];
            if (q.filename.startsWith('*')) {
                let ext = q.filename.substring(1);
                matchedFiles = files.filter(f => f.endsWith(ext));
            } else if (q.filename.endsWith('*')) {
                let prefix = q.filename.substring(0, q.filename.length - 1);
                matchedFiles = files.filter(f => f.startsWith(prefix));
            } else {
                if (files.includes(q.filename)) matchedFiles = [q.filename];
            }

            if (matchedFiles.length > 0) {
                if (!ignorePaths[item.tag]) {
                    ignorePaths[item.tag] = { values: [] }
                }

                if (q.struct) {
                    matchedFiles.forEach(f => {
                        try {
                            let obj = JSON.parse(fs.readFileSync(path.join(dir, f)).toString('utf8'));
                            ignorePaths[item.tag].values.push(acessAttrObj(obj, q.struct));
                        } catch (error) {
                            console.error(`[gign] error on model of ${item.tag}, struct: ${q.struct}, file: ${f}`);
                        }
                    });
                }
                else if (q.path) {
                    ignorePaths[item.tag].values.push(q.path)
                }
            }
        })

    })

    return [tags, ignorePaths];
}

function acessAttrObj(obj, struct) {
    let attrs = struct.split('.');
    attrs.forEach(att => {
        obj = obj[att];
    });
    return obj;
}