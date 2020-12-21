# configU
> A lightweight config management tool


## Installation
* Clone or download this repo into your Ubuntu machine
* Bootstrap your machine by:
  
  ```bash
    cd configU
    sudo chmod 0755 bootstrap.sh
    ./bootstrap.sh
  ```

## Support
* Created for Ubuntu Linux
* Tested on Ubuntu 18.04
* Only supports invocation from CLI.

## Usage
* Create a config file by including configU at the top
  ```js
    const configU = require("./src/configU");
  ```

* Check sample config file `hello-world-php-config.js` for reference. 
* Start by installing packages first in the configuration
* Configure the files as needed
* Finally, restart the service so that file changes get reflected with `restartService()`
* To invoke the configuration file:

  ```bash
   sudo node hello-world-php-config.js
  ```

## Command reference
### File Manangement
> * Write and append content to file, remove files.
> * Specify a file's content and metadata (owner, group, mode)

#### saveFileContent(filepath, content);
> * Create a file `filepath` with `content` if it doesn't exist.
> * If `content` for `filepath` does not match the existing content, update the `filepath` to match the content of the configuration. 

* Invocation:

  ```js
   // Writes contents 'Hello World!' to filepath `/${process.env.HOME}/helloWorld.txt`
   configU.saveFileContent(`/${process.env.HOME}/helloWorld.txt`, 'Hello, World!');
  ```

#### addContentToFile(filepath, content);
> Appends `content` to the end of file `filepath` if `filepath` does not already contain `content`.

* Invocation:

    ```js
    // Appends `contents` '127.0.0.1 localhost' to `filepath` `/etc/hosts`
    configU.addContentToFile('/etc/hosts', '127.0.0.1 localhost');
    ```

#### removeFile(filepath);
> Removes a file if it exists.

* Invocation:

    ```js
    // Removes `/${process.env.HOME}/hello.txt`
    configU.removeFile(`/${process.env.HOME}/hello.txt`);
    ```

#### writeFilePermissions(filepath, mode);
> Adjusts access permissions `mode` on a `filepath`.

* Invocation:

    ```js
    // Sets access permissions `/${process.env.HOME}/hello.txt` to `0755`.
    configU.writeFileOwner(`/${process.env.HOME}/hello.txt`, 0755);
    ```

#### writeFileOwner(filepath, uid, gid);
> Adjusts user `uid` and groud `gid` for a given file `filepath`.

* Invocation
    ```js
    // Sets user to root (`0`) to and group to root (`0`) for `/${process.env.HOME}/hello.txt`.
    configU.writeFilePermissions(`/${process.env.HOME}/hello.txt`, 0, 0);
    ```

### Package Manager
> Manages debian packages

#### installPackage(pkg);
> Installs a single package

* Invocation:

    ```js
    configU.installPackage('shelljs');
    ```
#### removePackage(pkg);
> Removes a single debian package.

* Invocation:

    ```js
    configU.removePackage('shelljs');
    ```

### Service restarts
> * To restart a service based on the cache of service version and file's metadata and timestamp.

#### restartService(service, files = [])
> * Restarts a service if the service package version has changed.
> * Restarts a service if a relevant file in array `files` has changed.

* Invocation:

    ```js
    // Restarts `nginx` if relevant config files:
    // '/etc/nginx/nginx.conf' & '/etc/nginx/nginx.conf' have changed.
    // Restarts service `nginx` if the package version has changed.

    configU.restartService(`nginx`, ['/etc/nginx/nginx.conf', '/etc/nginx/nginx.conf']);
    ```