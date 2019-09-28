BPMN
====

Web application to generate bpmn diagram

Use

- bpmn-js from https://github.com/bpmn-io/bpmn-js
- icon from https://feathericons.com/ 

You can run with docker

::

    docker run -p 80:80 --rm --name bpmn -t fraoustin/bpmn 

Init env
--------

::

    mkdir mybpmn
    cd mybpmn
    npm init
    npm install --save bpmn-js
    npm install --save diagram-js
    npm install --save jquery
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


Installation
------------

::

    git clone https://github.com/fraoustin/bpmn.git
    cd bpmn
    npm install
    npm run dev

You can generate build

::

    npm run build

Docker
------

You can generate your container

::

    git clone https://github.com/fraoustin/bpmn.git
    cd bpmn
    docker build -t bpmn .
    docker run --rm -p 80:80 -t bpmn

Usage
-----

TODO

Feature
-------

- add webdav connection (open, save and connection)
- export png
