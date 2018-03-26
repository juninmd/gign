const fs = require('fs');
const pattern = require('../../pattern.json');
const manual = require('../../manual.json');

module.exports = (dir) => {
    const tags = [];
    let ignorePaths = {};

    const files = fs.readdirSync(dir);

    if (!files.includes('.git')) {
        console.warn('[gign] Initialize a git repository, use "git init" command')
    }

    pattern.map(q => {
        let key = Object.keys(q)[0];
        let itens = q[key];
        if (itens.some(r => files.includes(r)) && !tags.includes(key))
            tags.push(key);
    })


    manual.map(item => {

        item.search.filter(q => {
            if (files.includes(q.filename)) {
                ignorePaths[item.tag] = { values: [] }

                if (q.struct) {
                    try {
                        let obj = JSON.parse(fs.readFileSync(`${dir}\\${q.filename}`).toString('utf8'));
                        ignorePaths[item.tag].values.push(acessAttrObj(obj, q.struct));
                    } catch (error) {
                        console.error(`[gign] error getting struct of ${item.tag}`);
                    }
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