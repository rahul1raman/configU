const fs = require('fs');
const sh = require('shelljs');
const mkdirp = require('mkdirp');

const configCacheRoot = `${process.env.HOME}/.cache/configU`;

//============= File related methods =================
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

exports.addContentToFile = (filepath, content) => {
    // Add content to the end of an existing file
    if (!fs.existsSync(filepath)) {
        console.error(`File does not exist, cannot append to ${filepath}`);
    } else {
        var existingFile = fs.readFileSync(filepath, 'utf8');
        if (!existingFile.includes(content)) {
            fs.appendFileSync(filepath, content);
            console.log(`The file ${filepath} updated with content.`);
        }
    }
};

exports.removeFile = (filepath) => {
    if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        console.info(`File ${filepath} has been removed.`);
    }
};
  
exports.writeFilePermissions = (filepath, mode) => {
    try {
        fs.chmodSync(filepath, mode);
    } catch (error) {
        console.error(`Failed to write permissions at ${filepath}. ${error}`);
    }
};
  
exports.writeFileOwner = (filepath, uid, gid) => {
    try {
        fs.chownSync(filepath, uid, gid);
    } catch (error) {
        console.error(`Failed to change owner at ${filepath}. ${error}`);
    }
};


// =========  PACKAGE related methods =================
exports.installPackage = (pkg) => {
    console.log(`Installing ${pkg}`);
    sh.exec(`sudo apt-get -y install ${pkg}`);
};
  
exports.removePackage = (pkg) => {
    console.log(`Removing ${pkg}`);
    sh.exec(`sudo apt-get -y remove ${pkg}`);
};


exports.restartService = (service, files = []) => {
     /**
      * Restart a serice when relavant files change.
      * Compare previously cached version of package or file metadata
      *  to check if there's been a change
      */
  
    // If any file in the array `files` returns true, restart the service.
    let fileChanged;
    files.forEach(function (file) {
      if (hasFileChanged(file)) {
        fileChanged = true;
      }
    });
  
    var cache = `${configCacheRoot}/${service}.cache`;
    var shouldRestart = false;
  
    if (fileChanged) {
      shouldRestart = true;
    }
    if (!fs.existsSync(cache)) {
      console.log(`Cache dir not found for ${service}.`);
      console.log('Creating config cache directory...');
  
      mkdirp.sync(configCacheRoot);
      cacheServiceVersion(service);
      shouldRestart = true;
    } else {
      var cacheData = fs.readFileSync(cache, 'utf8');
      var checkPackageData = sh.exec(`apt list ${service}`);
        

      if (cacheData !== checkPackageData.toString()) {
        console.log(`Package version for ${service} changed.`);
        cacheServiceVersion(service);
        shouldRestart = true;
      }
    }
    if (shouldRestart) {
      console.log(`Restarting ${service}.`);
      sh.exec(`sudo service ${service} restart`);
    }
  };
  
function hasFileChanged (file) {
    if (fs.existsSync(file)) {
        var fileStats = fs.statSync(file);
        var cacheTime = readCacheModifyTime(file);

        if (fileStats.mtime.toString() !== cacheTime) {
            cacheFileModifyTime(file);
            return true;
        }
    }
    return false;
}
  
  function cacheFileModifyTime (filepath) {
    var modStats = fs.statSync(filepath);
    var cacheName = filepath.replace(/\//g, '-');
  
    mkdirp.sync(configCacheRoot);
    fs.writeFileSync(`${configCacheRoot}/${cacheName}.mtime`, modStats.mtime);
  }
  
  function readCacheModifyTime (filepath) {
    var cacheName = filepath.replace(/\//g, '-');
    var cacheFilePath = `${configCacheRoot}/${cacheName}.mtime`;
  
    if (fs.existsSync(cacheFilePath)) {
      var cacheContents = fs.readFileSync(cacheFilePath, 'utf8');
      return cacheContents;
    }
  }
  
  // get service's package version and store it in cache
  function cacheServiceVersion (service) {
    let serviceCache = sh.exec(`apt list ${service}`);
    fs.writeFileSync(`${configCacheRoot}/${service}.cache`, serviceCache);
  }

