[![Build](https://travis-ci.org/cloudwheels/cw-pagetojson.svg?branch=master)](https://travis-ci.org/cloudwheels/cw-pagetojson.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/cloudwheels/cw-pagetojson/badge.svg?branch=master)](https://coveralls.io/github/cloudwheels/cw-pagetojson?branch=master)
[![Dependencies](https://david-dm.org/cloudwheels/cw-pagetojson.svg)](https://david-dm.org/cloudwheels/cw-pagetojson.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/cloudwheels/cw-pagetojson/badge.svg?targetFile=package.json)](https://snyk.io/test/github/cloudwheels/cw-pagetojson?targetFile=package.json)

# changes by cloudwheels
> originl package(s) by [maugenst](https://github.com/maugenst/pagetojson)

* removed convert from URL funcionality and dependency on request
* looking to use as part of a webpacked bundle with browser client targets
* Upgraded babel to 7

# pagetojson

This project is meant to be a "shell" around other 'tagname'tojson projects like tabletojson. 
When implementing a specific tag in a separate project one can decide to either use the full 
blown shell or the little project just needed for his use case.

So ... it basically converts just parts that are known yet into an Object Array of JSON objects.
This list will grow over the time, so feel free to attend here and add your own 'tagname'tojson which 
will be added to the dependencies list.

## Installation

```bash
npm install pagetojson
```

## Usage

```javascript
const pagetojson = require('../lib/pagetojson');

const converted = pagetojson.convert('HTML-STRING', {
    tags: ['table', 'list']
})

console.log(converted)

// Result:
{
    table: [
        0: [...],
        1: [...],
        2: [...]
    ],
     list: [
         0: [...],
         1: [...],
         2: [...]
    ]
}

```

# Abstraction

Providing an Abstraction layer for implementing own "toJson"-conversions. Once 
a reference to pagetojson is defined a package can extend `AbstractToJson` and must implement
the two methods `convert` and `convertUrl`.

