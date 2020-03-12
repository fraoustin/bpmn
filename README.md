# BPMN

Web application to generate bpmn diagram

Use

- bpmn-js from https://github.com/bpmn-io/bpmn-js
- icon from https://feathericons.com/
- siimple.xyz http://siimple.xyz 

You can run with docker

::

    docker run -p 80:80 --rm --name bpmn -t fraoustin/bpmn 

## Init env

::

    mkdir mybpmn
    cd mybpmn
    npm init
    npm install --save bpmn-js
    npm install --save diagram-js
    npm install --save jquery
    npm install --save bpmn-js-properties-panel
    npm install --save-dev webpack
    npm install --save-dev webpack-cli
    npm install --save-dev webpack-dev-server
    npm install --save-dev copy-webpack-plugin
    npm install --save-dev raw-loader
    npm install --save diagram-js-minimap
    npm install --save tiny-svg

add in package.json

::

    "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack-dev-server --content-base=public --open"
    },

    "author": {
    "name": "Frédéric Aoustin",
    "url": "https://github.com/fraoustin"
    },


## Installation

::

    git clone https://github.com/fraoustin/bpmn.git
    cd bpmn
    npm install
    npm run dev

You can generate build

::

    npm run build

## Platform webdav

generate a nginx server webdav

You can use client

- ihm on http://127.0.0.1/ (minimal ihm)
- windows : winscp https://sourceforge.net/projects/winscp/
- android : in play store you can find apps (WebDAV Navigator Lite, ...)
- linux : by nautilus (davfs://127.0.0.1/) or by davfs2 

    apt-get install davfs2

    mount.davfs http://127.0.0.1/auth /media/mywebdav

You can read https://doc.ubuntu-fr.org/davfs2


load when start image load file in

- /usr/share/gitweb/docker-entrypoint.pre
- /usr/share/gitweb/docker-entrypoint.post

### Parameter

- SET_CONTAINER_TIMEZONE (false or true) manage time of container
- CONTAINER_TIMEZONE timezone of container
- DAVUSER (default user)
- DAVPASSWORD (default pass)

### Volume

- /share

note: check authorization on directory /share

### Port

- 80 

### Command

- addauth : add user for git
- rmauth : remove user

### Usage direct

run image fraoustin/bpmn

    docker run -d -v <localpath>:/share --name bpmn -p 80:80 fraoustin/bpmn

user default is *user* and password default is *pass*

you use http://localhost/ for access login ihm

### Usage by Dockerfile

Sample of Dockerfile

    FROM fraoustin/bpmn
    COPY ./00_init.sh /usr/share/docker-entrypoint.pre/00_init.sh
    RUN chmod +x -R /usr/share/gitweb/docker-entrypoint.pre

File 00_init.sh

    #!/bin/bash
    if [ ! -z "$DAVUSER" ]; then
        addauth $DAVUSER $DAVPASSWORD
    fi    


build image bpmn

    docker build -t mybpmn .

run image mybpmn

    docker run -d -e "CONTAINER_TIMEZONE=Europe/Paris" -e DAVUSER=myuser" -e "DAVPASSWORD=mypassword" -v <localpath>:/share --name test -p 80:80 mybpmn


### For developer

    git clone https://github.com/fraoustin/bpmn.git
    docker build -t mybpmn .
    docker run -d -v c:/users/myhome/workspace/bpmn/platform/minimal:/theme/minimal -v c:/users/myhome/downloads:/share --name test -p 8080:80 mybpmn

## External library

- wedav.js on https://github.com/aslakhellesoy/webdavjs

