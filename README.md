# babel-plugin-transform-simple-jsx

[![Version](https://img.shields.io/npm/v/babel-plugin-transform-simple-jsx.svg)](https://npmjs.org/package/babel-plugin-transform-simple-jsx)
[![Build Status](https://img.shields.io/travis/pikamachu/pika-babel-plugin-transform-simple-jsx/master.svg)](https://travis-ci.com/pikamachu/pika-babel-plugin-transform-simple-jsx)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/7a5d465f487e4f55a8e50e8201cc69b1)](https://www.codacy.com/project/antonio.marin.jimenez/pika-babel-plugin-transform-simple-jsx/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=pikamachu/pika-babel-plugin-transform-simple-jsx&amp;utm_campaign=Badge_Grade_Dashboard)
[![codecov](https://codecov.io/gh/pikamachu/pika-babel-plugin-transform-simple-jsx/branch/master/graph/badge.svg)](https://codecov.io/gh/pikamachu/pika-babel-plugin-transform-simple-jsx)

## Introduction

Babel plugin for simple jsx to string transformation

## Usage

``` bash
npm install\
  babel-plugin-transform-simple-jsx\
  babel-preset-env\
  --save-dev
```

In your `.babelrc`:

``` json
{
  "presets": ["@babel/preset-env"],
  "plugins": ["babel-plugin-transform-simple-jsx"]
}
```

The plugin transpiles the following E4X code:

``` js
const fooId = 'foo-id';
const barText = 'bar text';

const html = (
  <div>
    <span id={fooId}>{barText}</span>
  </div>
);

```

To the following JavaScript:

``` js
var JSX = require("simple-jsx");

var fooId = 'foo-id';
var barText = 'bar text';

var html = JSX("<div><span id=\"" + (fooId) + "\">" + (barText) + "</span></div>");

```

See tests for more examples and details.

## Examples

### Web Rendering

* [Client side web rendering example using jsx](./examples/web-rendering/client-side/README.md)
* [Server side web rendering example using jsx](./examples/web-rendering/server-side/README.md)


## Requirements

- Babel 7 compatible

## Developing

### Built with

* [simple-jsx](https://github.com/pikamachu/pika-simple-jsx)

### Folder structure

* root: Contains the README.md, the main configuration to execute the project such as package.json or any other configuration files.
* lib: Contains the source code for plugin.
* test: Contains library tests and examples.
* examples: Contains library examples.
* node_modules: Contains third party JS libraries used in this project

### Setting up Dev

Download the code

```shell
git clone git@github.com:pikamachu/pika-babel-plugin-transform-simple-jsx.git
cd pika-babel-plugin-transform-simple-jsx
```

Install dependencies

```shell
bash pika install
```

Run application tests.

```shell
bash pika test
```
