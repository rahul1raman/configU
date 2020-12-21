const fs = require('fs');
const sh = require('shelljs');


exports.saveFileContent = (filepath, content) => {
    try {
        // If file doesn't exist, save content
        if (!fs.existsSync(filepath)) {
            fs.writeFileSync(filepath, content);
            console.info(`The file ${filepath} has been saved.`);
        } else {
            // If file exists, only save if content is new
            var data = fs.readFileSync(filepath, 'utf8');
            if (data !== content) {
                fs.writeFileSync(filepath, content);
                console.info(`File ${filepath} content updated with new config.`);
            }
        }
    } catch (e) {
        console.error(`Error saving content to ${filepath}`, e);
    }
};

exports.removeFile = function remove (filepath) {
    if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        console.info(`File ${filepath} has been removed.`);
    }
};
  
exports.writeFilePermissions = function write (filepath, mode) {
    try {
        fs.chmodSync(filepath, mode);
    } catch (error) {
        console.error(`Failed to write permissions at ${filepath}. ${error}`);
    }
};
  
exports.writeFileOwner = function write (filepath, uid, gid) {
    try {
        fs.chownSync(filepath, uid, gid);
    } catch (error) {
        console.error(`Failed to change owner at ${filepath}. ${error}`);
    }
};

