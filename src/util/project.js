const fs = require('fs');
const pattern = require('../../pattern.json');

module.exports = (dir) => {
    const tags = [];

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
    return tags;
}
