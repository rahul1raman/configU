const configU = require("./src/configU");

// apache configs
const apacheRoot = '/var/www/html';
const apacheConf = '/etc/apache2/apache2.conf';
const apacheSitesAvailable = '/etc/apache2/conf-available/servername.conf';
const hostname = '/etc/hostname';

var relevantFiles = [
    `${apacheRoot}/index.php`,
    `${apacheRoot}/index.html`,
    apacheConf,
    apacheSitesAvailable,
    hostname
  ];
  
var phpContent = `<?php
header("Content-Type: text/plain");
echo "Hello, world!\n"; ?>`;
  
// Install packages
configU.installPackage('apache2');
configU.installPackage('libapache2-mod-php5');
configU.installPackage('php5');
  
// Configure Apache Files
configU.removeFile(`${apacheRoot}/index.html`, 'apache2');
configU.saveFileContent(`${apacheRoot}/index.php`, phpContent);
configU.addContentToFile(apacheConf, 'ServerName    localhost');
configU.saveFileContent(hostname, 'localhost');
  
// Restart the Apache service
configU.restartService('apache2', relevantFiles);