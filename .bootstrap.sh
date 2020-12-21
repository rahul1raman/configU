#!/bin/sh

# clean the package manager cache
 sudo apt-get clean

# check for updates
sudo apt-get -y update

# check for upgrades
sudo apt-get -y upgrade

# get the setup for node 12.x
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -

# install node & npm
sudo apt-get -y install nodejs
npm install
