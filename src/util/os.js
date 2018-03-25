const os = require('os');

module.exports = () => {
    switch (os.type()) {
        case 'Windows_NT':
            return "windows";
        case 'Linux':
            return "linux";
        default:
            return "macos";
    }
}
